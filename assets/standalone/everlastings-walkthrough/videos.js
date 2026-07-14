/* The walkthrough manifest.
   Video + poster live on the CDN; captions are same-origin (a cross-origin <track>
   would need CORS headers R2 does not send). Durations are ffprobe-exact. */

const CDN = 'https://cdn.august.style/media/everlastings-walkthrough';

const SECTIONS = [
  { id: 'start', label: 'Getting started', note: 'What this is, and what it lets you do.' },
  { id: 'shop', label: 'The shop, as a customer sees it', note: 'A piece, a cart, a checkout, a receipt.' },
  { id: 'chat', label: 'Running the store from ChatGPT', note: 'Ask it anything. Tell it to do anything.' },
  { id: 'desk', label: 'Running the store by hand', note: 'The same powers, at your own desk.' },
];

const VIDEOS = [
  {
    n: 1, section: 'start', duration: 53.1,
    title: 'Welcome — and why this is unusual',
    blurb: 'Why a store you run by talking to it barely exists yet.',
  },
  {
    n: 2, section: 'start', duration: 75.3,
    title: 'What you’ll be able to do',
    blurb: 'The rule we built to: anything you need to do, ChatGPT can do — and so can you.',
  },
  {
    n: 3, section: 'shop', duration: 62.1,
    title: 'The storefront, and buying a piece',
    blurb: 'Galleries, looping video, a live sale, two pieces into the cart.',
  },
  {
    n: 4, section: 'shop', duration: 58.1,
    title: 'Checkout, and the buyer’s receipt',
    blurb: 'Verified addresses, the sale already applied, and a receipt in your colours.',
  },
  {
    n: 5, section: 'chat', duration: 78.2,
    title: 'Asking ChatGPT about your store',
    blurb: 'What’s live, what needs shipping, what’s on sale — then drill into any of it.',
  },
  {
    n: 6, section: 'chat', duration: 42.1,
    title: 'Telling ChatGPT what to do',
    blurb: 'End a sale and mark an order shipped, in one sentence.',
  },
  {
    n: 7, section: 'chat', duration: 109.6,
    title: 'Creating a product with ChatGPT',
    blurb: 'Hand it the photos, say what the piece is, and let it draft the listing.',
  },
  {
    n: 8, section: 'chat', duration: 101.2,
    title: 'Filling the gaps, then publishing',
    blurb: 'It writes the alt text and the SEO, tells you what’s missing, and waits for you to publish.',
  },
  {
    n: 9, section: 'desk', duration: 66.9,
    title: 'The dashboard — and how refunds work',
    blurb: 'Live, drafts, sold, archived — and refunding part of an order while relisting the piece.',
  },
  {
    n: 10, section: 'desk', duration: 82.4,
    title: 'Coupons and store-wide sales',
    blurb: 'Minimums, usage caps, share links — and the one-time code every new subscriber gets.',
  },
  {
    n: 11, section: 'desk', duration: 136.2,
    title: 'Creating a product by hand',
    blurb: 'Title and price first; the technical fields fill themselves in behind you.',
  },
  {
    n: 12, section: 'desk', duration: 160.1,
    title: 'Adding photos, and previewing',
    blurb: 'Give each photo a role, and it gets cropped, compressed and served for you.',
  },
].map((v) => {
  const nn = String(v.n).padStart(2, '0');
  return {
    ...v,
    id: nn,
    src: `${CDN}/using-your-website-${nn}.mp4`,
    poster: `${CDN}/poster-${nn}.webp`,
    captions: `captions/using-your-website-${nn}.vtt`,
  };
});
