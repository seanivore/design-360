# CDN upload — exact instructions for `shop-admin` demo

Everything the demo's `data.js` references, mapped to its final URL. Hand this to
Claude Code (or follow it directly). Two products kept from the real Everlastings
shop (the archived dioramas) use the existing Everlastings CDN and need **no upload**.

## The rule

- **Base:** `https://cdn.august.style/media/shop-admin/<slug>/`
- **Object key** = everything after the host: `media/shop-admin/<slug>/<filename>`
- **Filenames** are exactly the ones in `DEMO_PRODUCTS_ASSETS.md` (your local
  `assets/.media/shop-admin/<slug>/…` files), i.e. `<role>-<slug>.<ext>` and
  `gallery-<slug>-<n>.<ext>` (un-padded n).
- **Images** → upload through `POST https://www.august.style/api/upload`
  (it downsizes/optimizes). **Videos** → put straight on the CDN at the same path.

### Extension
`data.js` is set to **`.webp`** for all images and posters (the Upload API outputs
webp), and **`.mp4`** for videos. Upload each image under its `.webp` object key —
e.g. `hero-<slug>.webp`, `gallery-<slug>-1.webp`, `poster-<slug>.webp`. The object
key and the URL in `data.js` must match exactly; that's the only thing that matters.

## Files to upload (images via API)

Each product needs: `hero-<slug>`, `gallery-<slug>-1…N`, `checkout-<slug>`,
`thumbnail-<slug>`. Video products also need `poster-<slug>`.

| slug                   | gallery N | poster         | video        |
| ---------------------- | --------- | -------------- | ------------ |
| `art-nouveau-poster`   | 1–6       | —              | —            |
| `art-deco-poster`      | 1–6       | —              | —            |
| `bauhaus-poster`       | 1–6       | —              | —            |
| `industrial-brutalism` | 1–3       | —              | —            |
| `mid-modern-tee`       | 1–7       | `poster-…webp` | `video-…mp4` |
| `glitch-art-shirt`     | 1–9       | —              | —            |
| `bauhaus-jumpsuit`     | 1–11      | —              | —            |
| `peruvian-leather-bag` | 1–6       | `poster-…webp` | `video-…mp4` |
| `retro-snapback`       | 1–6       | `poster-…webp` | `video-…mp4` |

So, e.g. for `art-nouveau-poster` the final URLs are:
```
https://cdn.august.style/media/shop-admin/art-nouveau-poster/hero-art-nouveau-poster.webp
https://cdn.august.style/media/shop-admin/art-nouveau-poster/gallery-art-nouveau-poster-1.webp
… gallery-…-2 … 3 … 4 … 5 … 6.webp
https://cdn.august.style/media/shop-admin/art-nouveau-poster/checkout-art-nouveau-poster.webp
https://cdn.august.style/media/shop-admin/art-nouveau-poster/thumbnail-art-nouveau-poster.webp
```

## Videos (straight to CDN, no API)

```
https://cdn.august.style/media/shop-admin/mid-modern-tee/video-mid-modern-tee.mp4
https://cdn.august.style/media/shop-admin/peruvian-leather-bag/video-peruvian-leather-bag.mp4
https://cdn.august.style/media/shop-admin/retro-snapback/video-retro-snapback.mp4
```

## No upload needed

`the-clockmakers-window` and `first-snow-stillwood` (the two archived dioramas) load
from `https://cdn.everlastingsbyemaline.com/test/<slug>/…` — already live on the
Everlastings dev CDN. If any of those 404, it's harmless (broken-image fallback), or
swap them for new pieces.

## After upload

Open the demo, sign in, and the images light up. If a whole product is blank, its
slug/extension doesn't match — compare the failing URL (devtools Network tab) to the
URL in `data.js` and reconcile one of them.
