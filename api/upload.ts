import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { corsHeaders, preflight } from './_lib/cors';
import { isTest, env } from './_lib/env';

// august.style media pipeline (adapted from everlastings-website api/upload.ts).
// Source image (by URL or multipart file) -> optional Cloudinary resize-to-fit-2400 + webp ->
// upload to Cloudflare R2 at the caller-supplied key -> delete from Cloudinary (free-tier hygiene) ->
// return the https://cdn.august.style/<key> URL. Single-owner, agent-driven: one API-key bearer, no user auth.

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env('R2_ACCESS_KEY_ID'),
    secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
  },
});

// Bearer ${UPLOAD_API_KEY} only. The portfolio has no user accounts — the sole caller is an agent/curl.
function authorized(request: Request): boolean {
  const auth = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!auth || !auth.toLowerCase().startsWith('bearer ')) return false;
  const token = auth.slice(7).trim();
  const expected = env('UPLOAD_API_KEY');
  return !!expected && token === expected;
}

const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4',
]);

// Only raster images go through Cloudinary; gif/svg/mp4 pass through byte-for-byte.
const TRANSFORMABLE = new Set(['image/jpeg', 'image/png', 'image/webp']);

function json(request: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json' },
  });
}

function getCloudinaryConfig(): { apiKey: string; apiSecret: string; cloudName: string } {
  const url = env('CLOUDINARY_URL');
  const m = url.match(/^cloudinary:\/\/(\d+):([^@]+)@(.+)$/);
  if (!m) throw new Error('Invalid CLOUDINARY_URL');
  return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
}

async function sha1Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// R2 object keys must live under media/ and be a safe relative path (the ENTRY_SOP CDN convention).
// In preview (isTest) we re-root under media/_preview/ so dev uploads never overwrite production CDN objects.
function normalizeKey(raw: string): string | null {
  const key = raw.trim().replace(/^\/+/, '');
  if (!key.startsWith('media/')) return null;
  if (key.includes('..') || key.includes('//')) return null;
  if (!/^[a-zA-Z0-9._/-]+$/.test(key)) return null;
  return isTest ? key.replace(/^media\//, 'media/_preview/') : key;
}

// SSRF guard for the by-URL path: https public hosts only (auth-gated, body never echoed, but the
// fetch still takes a caller-supplied URL). Drive/CDN/public links are unaffected.
function isPublicHttpUrl(raw: string): boolean {
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== 'https:') return false;
  const host = u.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal')) return false;
  if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(host)) return false;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false;
  if (host.includes(':') && (host === '::1' || /^(fc|fd|fe80)/.test(host))) return false;
  return true;
}

export async function OPTIONS(request: Request) {
  return preflight(request)!;
}

// The core: (optionally) transform via Cloudinary, then PUT to R2 at `key`. Returns the public CDN url.
async function processToR2(
  bytes: Buffer, mime: string, key: string, transform: boolean,
): Promise<{ url: string; key: string }> {
  let finalBuffer = bytes;
  let contentType = mime;
  let outKey = key;

  if (transform && TRANSFORMABLE.has(mime)) {
    const cloud = getCloudinaryConfig();

    // Signed upload (no dependency on a dashboard upload preset; destroy below reuses the pattern).
    const uploadTs = Math.floor(Date.now() / 1000);
    const uploadSig = await sha1Hex(`timestamp=${uploadTs}${cloud.apiSecret}`);
    const uploadForm = new FormData();
    uploadForm.append('file', new Blob([bytes], { type: mime }));
    uploadForm.append('api_key', cloud.apiKey);
    uploadForm.append('timestamp', String(uploadTs));
    uploadForm.append('signature', uploadSig);

    const up = await fetch(`https://api.cloudinary.com/v1_1/${cloud.cloudName}/image/upload`, {
      method: 'POST', body: uploadForm,
    });
    if (!up.ok) throw new Error(`cloudinary upload ${up.status}: ${await up.text()}`);
    const { public_id: publicId } = (await up.json()) as { public_id?: string };
    if (!publicId) throw new Error('cloudinary upload returned no public_id');

    // Keep original size + aspect ratio; only shrink to fit a 2400x2400 box when larger; output webp.
    const transformUrl =
      `https://res.cloudinary.com/${cloud.cloudName}/image/upload/c_limit,w_2400,h_2400,f_webp,q_auto/${publicId}`;
    const tr = await fetch(transformUrl);
    if (!tr.ok) throw new Error(`cloudinary transform ${tr.status}`);
    finalBuffer = Buffer.from(await tr.arrayBuffer());
    contentType = 'image/webp';
    outKey = key.replace(/\.[a-zA-Z0-9]+$/, '') + '.webp';

    // Delete from Cloudinary to stay on the free tier (non-fatal — the bytes are already in hand).
    const delTs = Math.floor(Date.now() / 1000);
    const delSig = await sha1Hex(`public_id=${publicId}&timestamp=${delTs}${cloud.apiSecret}`);
    const delForm = new FormData();
    delForm.append('public_id', publicId);
    delForm.append('api_key', cloud.apiKey);
    delForm.append('timestamp', String(delTs));
    delForm.append('signature', delSig);
    const del = await fetch(`https://api.cloudinary.com/v1_1/${cloud.cloudName}/image/destroy`, {
      method: 'POST', body: delForm,
    });
    if (!del.ok) console.error('cloudinary destroy failed (non-fatal):', await del.text());
  }

  await s3.send(new PutObjectCommand({
    Bucket: env('R2_BUCKET_NAME'),
    Key: outKey,
    Body: finalBuffer,
    ContentType: contentType,
  }));

  return { url: `${env('R2_PUBLIC_URL')}/${outKey}`, key: outKey };
}

export async function POST(request: Request) {
  if (!authorized(request)) return json(request, { error: 'Unauthorized' }, 401);

  let bytes: Buffer;
  let mime: string;
  let keyRaw: string;
  let skipTransform = false;

  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    let body: { url?: unknown; key?: unknown; skip_transform?: unknown };
    try { body = (await request.json()) as typeof body; } catch { return json(request, { error: 'Invalid JSON body' }, 400); }
    if (typeof body.url !== 'string' || typeof body.key !== 'string') {
      return json(request, { error: 'Missing url or key' }, 400);
    }
    skipTransform = body.skip_transform === true || body.skip_transform === 'true';
    const safeUrl = body.url.trim();
    if (!isPublicHttpUrl(safeUrl)) return json(request, { error: 'url must be a public https URL' }, 400);
    keyRaw = body.key;
    let res: Response;
    try { res = await fetch(safeUrl, { redirect: 'follow' }); } catch { return json(request, { error: 'could not fetch url' }, 400); }
    if (!res.ok) return json(request, { error: `fetch failed (HTTP ${res.status})` }, 400);
    mime = (res.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
    if (!ALLOWED_MIME.has(mime)) return json(request, { error: `unsupported type "${mime || 'unknown'}"` }, 400);
    bytes = Buffer.from(await res.arrayBuffer());
  } else {
    let form: FormData;
    try { form = await request.formData(); } catch { return json(request, { error: 'Invalid multipart form' }, 400); }
    const f = form.get('file');
    const k = form.get('key');
    const st = form.get('skip_transform');
    skipTransform = typeof st === 'string' && st === 'true';
    if (!(f instanceof File) || typeof k !== 'string') return json(request, { error: 'Missing file or key' }, 400);
    mime = f.type.toLowerCase();
    if (!ALLOWED_MIME.has(mime)) return json(request, { error: `unsupported type "${mime || 'unknown'}"` }, 400);
    keyRaw = k;
    bytes = Buffer.from(await f.arrayBuffer());
  }

  if (bytes.length > 25 * 1024 * 1024) return json(request, { error: 'file too large (max 25MB)' }, 400);

  const key = normalizeKey(keyRaw);
  if (!key) {
    return json(request, { error: 'key must be a safe path under media/ (e.g. media/<slug>/bleed-1-<slug>-1.webp)' }, 400);
  }

  try {
    const out = await processToR2(bytes, mime, key, !skipTransform);
    return json(request, { ok: true, url: out.url, key: out.key });
  } catch (err) {
    console.error('upload error:', err);
    return json(request, { error: 'upload failed' }, 500);
  }
}
