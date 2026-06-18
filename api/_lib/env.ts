// Single source of truth for "are we in production?" — drives the preview key-namespacing in upload.ts.
export const isTest = process.env.VERCEL_ENV !== 'production';

// Vercel env values can import with trailing newlines; trim defensively.
// Returns '' for unset keys so call sites can decide between throw / fallback / pass-through.
export function env(key: string): string {
  return (process.env[key] ?? '').trim();
}
