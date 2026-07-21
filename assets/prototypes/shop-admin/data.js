/* ============================================================================
   Creator Portal — data.js   (PORTFOLIO DEMO seed)

   This is the seed dataset for the public, playable demo. It is loaded once,
   copied into the session store (see PORTAL.store in portal.js), and reset on
   sign-out. Shapes still match the production contract (data-flow.md) so the
   demo behaves like the real admin. Money is INTEGER CENTS (render with money()).

   ── ASSETS ────────────────────────────────────────────────────────────────
   Image/video URLs are built from CDN below. Filenames match the keys in
   DEMO_PRODUCTS_ASSETS.md exactly:  <role>-<slug>.<ext>  and
   gallery-<slug>-<n>.<ext>  (un-padded n).  Until the files are uploaded the
   broken-image fallback keeps the layout intact.

   ⚠ TWO THINGS TO CONFIRM before/at upload (one-line changes here if different):
     1. CDN host + path  → currently  https://cdn.august.style/media/shop-admin
     2. Extension         → currently  .jpg (+ one .png poster, .mp4 video).
        If the Upload API rewrites to .webp, change DEFAULT_EXT below to "webp".
   ============================================================================ */
(function () {
  "use strict";

  const CDN = "https://cdn.august.style/media/shop-admin";
  const DEFAULT_EXT = "webp"; // everything uploaded via the API is .webp (videos stay .mp4)
  const A = (slug, role, ext) => `${CDN}/${slug}/${role}-${slug}.${ext || DEFAULT_EXT}`;
  // images jsonb: [hero, gallery-1 … gallery-n]
  function imgs(slug, n, alts) {
    alts = alts || {};
    const a = [{ url: A(slug, "hero"), alt: alts.hero || "" }];
    for (let i = 1; i <= n; i++) a.push({ url: `${CDN}/${slug}/gallery-${slug}-${i}.${DEFAULT_EXT}`, alt: "" });
    return a;
  }
  const vid = (slug, posterExt) => [{ type: "video", url: A(slug, "video", "mp4"), poster: A(slug, "poster", posterExt || DEFAULT_EXT), loop: true, autoplay: true, controls: false, alt: "" }];

  /* legacy Everlastings dev-CDN (for the two archived dioramas kept from the real shop — no upload needed) */
  const LCDN = "https://cdn.everlastingsbyemaline.com/test";
  function legImgs(slug, n) {
    const a = [{ url: `${LCDN}/${slug}/test_hero-${slug}.webp`, alt: "" }];
    for (let i = 1; i < n; i++) a.push({ url: `${LCDN}/${slug}/test_gallery-${String(i).padStart(2, "0")}-${slug}.webp`, alt: "" });
    return a;
  }
  const legThumb = (slug) => `${LCDN}/${slug}/test_thumbnail-${slug}.webp`;

  /* ---------------------------------------------------------------- PRODUCTS */
  const products = [
    /* 1 ── Art Nouveau poster (print, LIVE, featured) */
    {
      id: "p1000000-0000-4000-8000-000000000001", sku: "AUG-nouveau01", slug: "art-nouveau-poster",
      title: "Art Nouveau Poster", headline: "Mucha, by way of midnight",
      story_card: "Whiplash vines and a face half-dreamed, pulled straight from the Art Nouveau canon and re-inked in tide-pool teal and coral. A print for the room where you do your best thinking.",
      description: "Archival giclée on heavyweight matte cotton stock, printed with pigment inks rated past 100 years. Shown in a solid walnut frame with a cream mat — ships framed and ready to hang.",
      features: ["Archival giclée, 100+ yr pigment inks", "Solid walnut frame + cream mat", "Arrives ready to hang"],
      price: 16500, quantity: 12, available: true, featured: true,
      product_type: "print", series: "Art Movements",
      materials: ["Archival matte cotton paper", "Pigment ink", "Solid walnut frame", "Acid-free mat"],
      care_instructions: ["Wipe glass with a dry microfiber cloth", "Keep out of direct sunlight", "Dust the frame gently"],
      shipping_details: ["Ships framed in 3–5 days", "Corner-protected, double-boxed, insured"],
      dimensions: '18" W x 1" D x 24" H', weight: "4.2 lbs", power_supply: null,
      artist_note: "The original is barely Nouveau — I let the linework go a little feral.",
      images: imgs("art-nouveau-poster", 6, { hero: "Teal and coral Art Nouveau print in a walnut frame" }),
      thumbnail: A("art-nouveau-poster", "thumbnail"), thumbnail_alt: "Art Nouveau poster, framed",
      media: [], seo_title: "Art Nouveau Poster — framed giclée print", seo_description: "Archival Art Nouveau giclée in teal and coral, framed in solid walnut.",
      seo_thumbnail: A("art-nouveau-poster", "checkout"),
      checkout_name: "Art Nouveau Poster", checkout_description: "Framed archival giclée print",
      checkout_image: A("art-nouveau-poster", "checkout"),
      is_published: true, published_at: "2026-06-21T18:10:00Z", draft: null, preview_token: null, archived_at: null,
    },
    /* 2 ── Art Deco poster (print, LIVE) */
    {
      id: "p1000000-0000-4000-8000-000000000002", sku: "AUG-deco0001", slug: "art-deco-poster",
      title: "Art Deco Poster", headline: "Sunrise, reduced to its geometry",
      story_card: "An arch, a rising sun, and a few taut lines holding the whole thing in tension — Art Deco distilled to its calmest possible breath. Warm sand, oxblood, deep teal.",
      description: "Archival giclée on matte cotton stock in a slim black metal frame. Pigment inks, cream mat, ready to hang the moment it lands.",
      features: ["Archival giclée, pigment inks", "Slim black metal frame", "Arrives ready to hang"],
      price: 14500, quantity: 0, available: true, featured: false,
      product_type: "print", series: "Art Movements",
      materials: ["Archival matte cotton paper", "Pigment ink", "Black metal frame", "Acid-free mat"],
      care_instructions: ["Wipe glass with a dry microfiber cloth", "Keep out of direct sunlight", "Dust the frame gently"],
      shipping_details: ["Ships framed in 3–5 days", "Corner-protected, double-boxed, insured"],
      dimensions: '24" W x 1" D x 18" H', weight: "4.0 lbs", power_supply: null,
      artist_note: "",
      images: imgs("art-deco-poster", 6, { hero: "Art Deco arch and sun print in a black frame" }),
      thumbnail: A("art-deco-poster", "thumbnail"), thumbnail_alt: "Art Deco poster, framed",
      media: [], seo_title: "Art Deco Poster — framed giclée print", seo_description: "Warm-toned Art Deco giclée, framed in slim black metal.",
      seo_thumbnail: A("art-deco-poster", "checkout"),
      checkout_name: "Art Deco Poster", checkout_description: "Framed archival giclée print",
      checkout_image: A("art-deco-poster", "checkout"),
      is_published: true, published_at: "2026-06-21T18:22:00Z", draft: null, preview_token: null, archived_at: null,
    },
    /* 3 ── Bauhaus poster (print, LIVE, featured) */
    {
      id: "p1000000-0000-4000-8000-000000000003", sku: "AUG-bauhs001", slug: "bauhaus-poster",
      title: "Bauhaus Poster", headline: "Form following nothing but joy",
      story_card: "Primary blocks and one long diagonal of light across a mid-century facade. The Bauhaus promise — that good design belongs to everyone — in red, yellow, and cobalt.",
      description: "Archival giclée on matte cotton stock in a clean white wood frame. Pigment inks, cream mat, ready to hang.",
      features: ["Archival giclée, pigment inks", "White wood gallery frame", "Arrives ready to hang"],
      price: 17500, quantity: 10, available: true, featured: true,
      product_type: "print", series: "Art Movements",
      materials: ["Archival matte cotton paper", "Pigment ink", "White wood frame", "Acid-free mat"],
      care_instructions: ["Wipe glass with a dry microfiber cloth", "Keep out of direct sunlight", "Dust the frame gently"],
      shipping_details: ["Ships framed in 3–5 days", "Corner-protected, double-boxed, insured"],
      dimensions: '24" W x 1" D x 20" H', weight: "4.4 lbs", power_supply: null,
      artist_note: "",
      images: imgs("bauhaus-poster", 6, { hero: "Primary-color Bauhaus architectural print in a white frame" }),
      thumbnail: A("bauhaus-poster", "thumbnail"), thumbnail_alt: "Bauhaus poster, framed",
      media: [], seo_title: "Bauhaus Poster — framed giclée print", seo_description: "Primary-color Bauhaus giclée, framed in white wood.",
      seo_thumbnail: A("bauhaus-poster", "checkout"),
      checkout_name: "Bauhaus Poster", checkout_description: "Framed archival giclée print",
      checkout_image: A("bauhaus-poster", "checkout"),
      is_published: true, published_at: "2026-06-22T15:02:00Z", draft: null, preview_token: null, archived_at: null,
    },
    /* 4 ── Industrial Brutalism (print, DRAFT — only 3 gallery shots, blocks publish) */
    {
      id: "p1000000-0000-4000-8000-000000000004", sku: "AUG-brutal01", slug: "industrial-brutalism",
      title: "Industrial Brutalism", headline: "Concrete, caught mid-thought",
      story_card: "A horizon of raw angular forms marching toward a far-off skyline — the austere, imposing beauty of brutalist architecture, rendered in silver and graphite.",
      description: "Black-and-white archival giclée on matte cotton stock in a brushed-silver frame. Pigment inks, cream mat, ready to hang.",
      features: ["Black-and-white archival giclée", "Brushed-silver frame", "Arrives ready to hang"],
      price: 15500, quantity: 8, available: false, featured: false,
      product_type: "print", series: "Art Movements",
      materials: ["Archival matte cotton paper", "Pigment ink", "Brushed-silver frame", "Acid-free mat"],
      care_instructions: ["Wipe glass with a dry microfiber cloth", "Keep out of direct sunlight", "Dust the frame gently"],
      shipping_details: ["Ships framed in 3–5 days", "Corner-protected, double-boxed, insured"],
      dimensions: '24" W x 1" D x 16" H', weight: "4.0 lbs", power_supply: null,
      artist_note: "Ran out of generations before I had a full gallery — this one's still in the darkroom.",
      images: imgs("industrial-brutalism", 3, { hero: "Black-and-white brutalist cityscape print in a silver frame" }),
      thumbnail: A("industrial-brutalism", "thumbnail"), thumbnail_alt: "Industrial Brutalism poster, framed",
      media: [], seo_title: "", seo_description: "", seo_thumbnail: "",
      checkout_name: "Industrial Brutalism", checkout_description: "Framed archival giclée print",
      checkout_image: A("industrial-brutalism", "checkout"),
      is_published: false, published_at: null, draft: null, preview_token: "prev-brutalism-1", archived_at: null,
    },
    /* 5 ── Mid-Century Modern tee (apparel, LIVE, featured, video) */
    {
      id: "p1000000-0000-4000-8000-000000000005", sku: "AUG-midtee01", slug: "mid-modern-tee",
      title: "Mid-Century Modern Tee", headline: "Mid-century, worn out loud",
      story_card: "Mid-century modern art printed across every inch of a fitted cotton tee — no logo, no negative space, just pattern from collar to hem. Made for rooftops at golden hour.",
      description: "All-over sublimation print on a fitted cotton-blend tee. Two prints, two fits. Colors stay true wash after wash; the print runs edge to edge with no break at the seams.",
      features: ["Edge-to-edge all-over print", "Fitted cotton-blend knit", "Two prints, two fits", "Colorfast, machine washable"],
      price: 5800, quantity: 40, available: true, featured: true,
      product_type: "apparel", series: "Mid-Century Modern",
      materials: ["Cotton-poly blend", "Water-based sublimation inks"],
      care_instructions: ["Machine wash cold, inside out", "Hang or lay flat to dry", "Do not iron directly on the print"],
      shipping_details: ["Ships in 2–4 days", "Recyclable mailer"],
      dimensions: '10" W x 2" D x 12" H', weight: "0.6 lbs", power_supply: null,
      artist_note: "Shot on the roof of a parking garage at the exact minute the light went gold.",
      images: imgs("mid-modern-tee", 9, { hero: "Model in an all-over mid-century print tee on a rooftop at dusk" }),
      thumbnail: A("mid-modern-tee", "thumbnail"), thumbnail_alt: "Mid-century modern all-over print tee",
      media: vid("mid-modern-tee"), seo_title: "Mid-Century Modern Tee — all-over print", seo_description: "Fitted cotton tee printed edge to edge in mid-century modern art.",
      seo_thumbnail: A("mid-modern-tee", "checkout"),
      checkout_name: "Mid-Century Modern Tee", checkout_description: "All-over print cotton tee",
      checkout_image: A("mid-modern-tee", "checkout"),
      is_published: true, published_at: "2026-06-23T17:40:00Z", draft: null, preview_token: null, archived_at: null,
    },
    /* 6 ── Barely Bauhaus linen shirt (apparel, LIVE with staged EDITS → yellow) */
    {
      id: "p1000000-0000-4000-8000-000000000006", sku: "AUG-glitch01", slug: "glitch-art-shirt",
      title: "Barely Bauhaus Linen Shirt", headline: "Barely Bauhaus, fully linen",
      story_card: "A 'barely Bauhaus' glitch print scattered across textured white linen — a men's dress shirt and an extra-long shirtdress cut from the same idea. Penthouse-at-midnight energy.",
      description: "All-over print on textured natural linen with gold-tone buttons. Offered as a men's tailored shirt and a women's longline shirtdress, both from the same glitched composition.",
      features: ["All-over glitch print on linen", "Gold-tone buttons", "Men's shirt + women's shirtdress", "Natural, breathable weave"],
      price: 14500, quantity: 22, available: true, featured: false,
      product_type: "apparel", series: "Barely Bauhaus",
      materials: ["Natural linen", "Gold-tone buttons"],
      care_instructions: ["Machine wash cold, gentle", "Cool iron if needed", "Line dry"],
      shipping_details: ["Ships in 2–4 days", "Folded, recyclable box"],
      dimensions: '11" W x 2" D x 14" H', weight: "0.9 lbs", power_supply: null,
      artist_note: "",
      images: imgs("glitch-art-shirt", 9, { hero: "Model in a barely-Bauhaus glitch-print linen shirt on a NYC rooftop" }),
      thumbnail: A("glitch-art-shirt", "thumbnail"), thumbnail_alt: "Barely Bauhaus glitch-print linen shirt",
      media: [], seo_title: "Barely Bauhaus Linen Shirt", seo_description: "Glitch-print natural linen shirt and shirtdress.",
      seo_thumbnail: A("glitch-art-shirt", "checkout"),
      checkout_name: "Barely Bauhaus Linen Shirt", checkout_description: "Glitch-print linen shirt",
      checkout_image: A("glitch-art-shirt", "checkout"),
      is_published: true, published_at: "2026-06-24T19:05:00Z", preview_token: "prev-glitch-1", archived_at: null,
      // staged edits on a live piece → yellow "edits" state
      draft: {
        headline: "Barely Bauhaus — now in a charcoal colorway",
        description: "All-over print on textured natural linen with gold-tone buttons. Men's tailored shirt and women's longline shirtdress, now offered in the original ivory plus a new charcoal glitch.",
        features: ["All-over glitch print on linen", "Gold-tone buttons", "Ivory + new charcoal colorway", "Men's shirt + women's shirtdress"],
      },
    },
    /* 7 ── Bauhaus jumpsuit (apparel, LIVE) */
    {
      id: "p1000000-0000-4000-8000-000000000007", sku: "AUG-jumpst01", slug: "bauhaus-jumpsuit",
      title: "Bauhaus Jumpsuit", headline: "Workwear for an apocalypse you'd enjoy",
      story_card: "Insulated jumpsuits printed edge-to-edge in original Bauhaus geometry and lined in plush faux fur. Built for cold mornings, shoveling snow, and looking unreasonable doing it.",
      description: "Natural-fiber insulated jumpsuit — all-over print outside, faux rabbit-fur lining inside. Full-length zip or button front by colorway. Four patterns in the series.",
      features: ["Edge-to-edge Bauhaus print", "Faux-fur lining", "Full-length zip / button front", "Four colorways"],
      price: 18500, quantity: 18, available: true, featured: false,
      product_type: "apparel", series: "Bauhaus Abstractions",
      materials: ["Natural-fiber shell", "Faux rabbit-fur lining", "Metal zip / buttons"],
      care_instructions: ["Machine wash cold, gentle", "Do not bleach", "Hang to dry"],
      shipping_details: ["Ships in 3–5 days", "Folded, recyclable box"],
      dimensions: '14" W x 4" D x 18" H', weight: "2.4 lbs", power_supply: null,
      artist_note: "Photographed outside a glass house in Iceland at the first light of morning. Worth the frostbite.",
      images: imgs("bauhaus-jumpsuit", 11, { hero: "Two models in all-over Bauhaus-print fur-lined jumpsuits outside a glass house" }),
      thumbnail: A("bauhaus-jumpsuit", "thumbnail"), thumbnail_alt: "All-over Bauhaus-print insulated jumpsuit",
      media: [], seo_title: "Bauhaus Jumpsuit — insulated, all-over print", seo_description: "Fur-lined insulated jumpsuit printed edge to edge in Bauhaus geometry.",
      seo_thumbnail: A("bauhaus-jumpsuit", "checkout"),
      checkout_name: "Bauhaus Jumpsuit", checkout_description: "Insulated all-over-print jumpsuit",
      checkout_image: A("bauhaus-jumpsuit", "checkout"),
      is_published: true, published_at: "2026-06-25T16:30:00Z", draft: null, preview_token: null, archived_at: null,
    },
    /* 8 ── Peruvian leather bags (merch, LIVE, featured, video) */
    {
      id: "p1000000-0000-4000-8000-000000000008", sku: "AUG-andes001", slug: "peruvian-leather-bag",
      title: "Peruvian Leather Bag", headline: "Beadwork that took someone a week",
      story_card: "Soft Peruvian leather, pressed with dark embroidered patterns and hand-beaded in vivid thread — a crossbody and a backpack, each one a little different from the last. Jungle-ready, gallery-worthy.",
      description: "Vegetable-tanned soft leather with deep tooled embossing and hand-applied glass beadwork. Adjustable strap, brass hardware, lined interior. Available as a crossbody or a backpack.",
      features: ["Hand-beaded glass panels", "Tooled & embossed leather", "Solid brass hardware", "Adjustable strap, lined interior"],
      price: 24000, quantity: 14, available: true, featured: true,
      product_type: "merch", series: "Andes Atelier",
      materials: ["Vegetable-tanned leather", "Glass seed beads", "Brass hardware", "Cotton lining"],
      care_instructions: ["Condition the leather seasonally", "Keep beadwork dry", "Store in the dust bag"],
      shipping_details: ["Ships in 3–5 days", "Wrapped and boxed"],
      dimensions: '11" W x 5" D x 13" H', weight: "1.8 lbs", power_supply: null,
      artist_note: "Each one is hand-beaded, so no two are identical — the photos are representative, not exact.",
      images: imgs("peruvian-leather-bag", 6, { hero: "Hand-beaded Peruvian leather crossbody and backpack on a woven rug" }),
      thumbnail: A("peruvian-leather-bag", "thumbnail"), thumbnail_alt: "Hand-beaded Peruvian leather bag",
      media: vid("peruvian-leather-bag"), seo_title: "Peruvian Leather Bag — hand-beaded", seo_description: "Hand-beaded vegetable-tanned leather crossbody and backpack.",
      seo_thumbnail: A("peruvian-leather-bag", "checkout"),
      checkout_name: "Peruvian Leather Bag", checkout_description: "Hand-beaded leather bag",
      checkout_image: A("peruvian-leather-bag", "checkout"),
      is_published: true, published_at: "2026-06-26T14:12:00Z", draft: null, preview_token: null, archived_at: null,
    },
    /* 9 ── Retro snapback (merch, LIVE, video) */
    {
      id: "p1000000-0000-4000-8000-000000000009", sku: "AUG-snap0001", slug: "retro-snapback",
      title: "Retro Snapback", headline: "Save your work",
      story_card: "A charcoal snapback with a 3.5\" floppy disk on the front and a hand-scrawled label that reads CLAUDE CODE — or CHAT GPT, if that's your stack. For people who ship.",
      description: "Structured six-panel snapback in heathered charcoal with an embroidered floppy-disk patch and an adjustable snap closure. Two labels available.",
      features: ["Embroidered floppy-disk patch", "Structured six-panel crown", "Adjustable snap closure", "Two labels: Claude Code / ChatGPT"],
      price: 4200, quantity: 50, available: true, featured: false,
      product_type: "merch", series: "Retro Tech",
      materials: ["Cotton-blend twill", "Embroidered patch"],
      care_instructions: ["Spot clean only", "Air dry", "Reshape the brim by hand"],
      shipping_details: ["Ships in 2–4 days", "Recyclable mailer"],
      dimensions: '9" W x 5" D x 5" H', weight: "0.4 lbs", power_supply: null,
      artist_note: "Yes, the label really does say Claude Code. The other one says ChatGPT. Pick your fighter.",
      images: imgs("retro-snapback", 6, { hero: "Charcoal floppy-disk snapback reading CLAUDE CODE" }),
      thumbnail: A("retro-snapback", "thumbnail"), thumbnail_alt: "Floppy-disk snapback cap",
      media: vid("retro-snapback"), seo_title: "Retro Snapback — floppy-disk cap", seo_description: "Charcoal snapback with an embroidered floppy-disk patch.",
      seo_thumbnail: A("retro-snapback", "checkout"),
      checkout_name: "Retro Snapback", checkout_description: "Floppy-disk snapback cap",
      checkout_image: A("retro-snapback", "checkout"),
      is_published: true, published_at: "2026-06-27T13:48:00Z", draft: null, preview_token: null, archived_at: null,
    },

    /* ── ARCHIVED dioramas kept from the real Everlastings shop (legacy CDN, no upload needed) ── */
    {
      id: "p1000000-0000-4000-8000-0000000000a1", sku: "EVE-clockwin", slug: "the-clockmakers-window",
      title: "The Clockmaker's Window", headline: "Where golden hour lingers longest",
      story_card: "A clockmaker's bench by a west window, gears caught mid-tick, the light never quite leaving. Time, held still on purpose. (An earlier piece from the Everlastings dioramas, kept here as an archived example.)",
      description: "Resin and reclaimed wood with brass-finish gears and miniature clock faces, lit by a warm LED that keeps the golden hour from ending.",
      features: ["Brass-finish gears", "Miniature clock faces", "Warm always-on LED"],
      price: 31000, quantity: 1, available: false, featured: false,
      product_type: "print", series: "— No collection —",
      materials: ["Resin", "Brass-finish gears", "Miniature clock faces", "Reclaimed wood", "LED"],
      care_instructions: ["Dust gently with a dry brush", "Indoor display only"],
      shipping_details: ["Ships in 3–5 days", "Double-boxed, fully insured"],
      dimensions: '9" W x 6" D x 10" H', weight: "3.0 lbs", power_supply: "USB-C, 5V",
      artist_note: "", images: legImgs("the-clockmakers-window", 7),
      thumbnail: legThumb("the-clockmakers-window"), thumbnail_alt: "Miniature clockmaker's bench at golden hour",
      media: [], seo_title: "", seo_description: "", seo_thumbnail: "",
      checkout_name: "The Clockmaker's Window", checkout_description: "Hand-built miniature haven",
      checkout_image: legThumb("the-clockmakers-window"),
      is_published: true, published_at: "2026-01-16T00:36:12Z", draft: null, preview_token: null,
      archived_at: "2026-04-02T09:00:00Z",
    },
    {
      id: "p1000000-0000-4000-8000-0000000000a2", sku: "EVE-firstsnw", slug: "first-snow-stillwood",
      title: "First Snow, Stillwood", headline: "A light kept against the snow",
      story_card: "The first snow of the year settling over a still wood, one lamp holding its ground. Quiet, and a little brave. (An earlier piece from the Everlastings dioramas, kept here as an archived example.)",
      description: "Resin and reclaimed wood under a drift of faux snow, miniature pines, and a dual-tone LED that shifts from cool dusk to warm window-light.",
      features: ["Dual-tone dusk/warm LED", "Hand-dusted faux snow", "Miniature pine grove"],
      price: 29500, quantity: 1, available: false, featured: false,
      product_type: "print", series: "— No collection —",
      materials: ["Resin", "Reclaimed wood", "Faux snow", "Miniature pines", "Dual-tone LED"],
      care_instructions: ["Dust gently with a dry brush", "Keep snow dry", "Indoor display only"],
      shipping_details: ["Ships in 3–5 days", "Double-boxed, fully insured"],
      dimensions: '10" W x 7" D x 8" H', weight: "3.1 lbs", power_supply: "USB-C, 5V",
      artist_note: "", images: legImgs("first-snow-stillwood", 9),
      thumbnail: legThumb("first-snow-stillwood"), thumbnail_alt: "Snowy miniature wood with a single lamp",
      media: [], seo_title: "", seo_description: "", seo_thumbnail: "",
      checkout_name: "First Snow, Stillwood", checkout_description: "Hand-built winter miniature haven",
      checkout_image: legThumb("first-snow-stillwood"),
      is_published: true, published_at: "2025-12-15T22:57:57Z", draft: null, preview_token: null,
      archived_at: "2026-03-20T09:00:00Z",
    },
  ];

  /* ------------------------------------------------------------------ ORDERS */
  /* One row per piece per checkout; siblings share stripe_payment_intent.
     Fake customers + fake addresses (this is a public demo). */
  const orders = [
    /* multi-piece checkout (shared intent): tee shipped, deco poster refunded */
    {
      id: "o1000000-0001-4000-8000-000000000001", stripe_payment_intent: "pi_demo_A1B2C3multi",
      amount: 5800, status: "shipped",
      customer_email: "maya.okafor@example.com",
      customers: { name: "Maya Okafor", email: "maya.okafor@example.com", phone: null },
      shipping_address: { line1: "418 Larkspur Lane", line2: "Apt 5", city: "Portland", state: "OR", postal_code: "97214", country: "US" },
      products: { title: "Mid-Century Modern Tee", slug: "mid-modern-tee", thumbnail: A("mid-modern-tee", "thumbnail") },
      tracking_number: "9400 1111 2222 3333 4444 55", tracking_carrier: "USPS",
      shipped_at: "2026-06-26T15:20:00Z", tracking_email_sent_at: "2026-06-26T15:20:30Z",
      created_at: "2026-06-25T22:04:00Z",
    },
    {
      id: "o1000000-0002-4000-8000-000000000002", stripe_payment_intent: "pi_demo_A1B2C3multi",
      amount: 14500, status: "refunded",
      customer_email: "maya.okafor@example.com",
      customers: { name: "Maya Okafor", email: "maya.okafor@example.com", phone: null },
      shipping_address: { line1: "418 Larkspur Lane", line2: "Apt 5", city: "Portland", state: "OR", postal_code: "97214", country: "US" },
      products: { title: "Art Deco Poster", slug: "art-deco-poster", thumbnail: A("art-deco-poster", "thumbnail") },
      tracking_number: null, tracking_carrier: null, shipped_at: null, tracking_email_sent_at: null,
      created_at: "2026-06-25T22:04:00Z",
    },
    /* just paid — needs shipping (drives the Orders blink) */
    {
      id: "o1000000-0003-4000-8000-000000000003", stripe_payment_intent: "pi_demo_D4E5F6snap",
      amount: 4200, status: "completed",
      customer_email: "devon.reyes@example.com",
      customers: { name: "Devon Reyes", email: "devon.reyes@example.com", phone: null },
      shipping_address: { line1: "27 Canalside", line2: null, city: "Brooklyn", state: "NY", postal_code: "11211", country: "US" },
      products: { title: "Retro Snapback", slug: "retro-snapback", thumbnail: A("retro-snapback", "thumbnail") },
      tracking_number: null, tracking_carrier: null, shipped_at: null, tracking_email_sent_at: null,
      created_at: "2026-06-28T19:36:00Z",
    },
    /* shipped */
    {
      id: "o1000000-0004-4000-8000-000000000004", stripe_payment_intent: "pi_demo_G7H8I9bag",
      amount: 24000, status: "shipped",
      customer_email: "priya.nair@example.com",
      customers: { name: "Priya Nair", email: "priya.nair@example.com", phone: null },
      shipping_address: { line1: "1180 Alameda St", line2: null, city: "Austin", state: "TX", postal_code: "78702", country: "US" },
      products: { title: "Peruvian Leather Bag", slug: "peruvian-leather-bag", thumbnail: A("peruvian-leather-bag", "thumbnail") },
      tracking_number: "1Z999AA10123456784", tracking_carrier: "UPS",
      shipped_at: "2026-06-27T17:50:00Z", tracking_email_sent_at: "2026-06-27T17:50:25Z",
      created_at: "2026-06-26T11:15:00Z",
    },
    /* just paid — needs shipping */
    {
      id: "o1000000-0005-4000-8000-000000000005", stripe_payment_intent: "pi_demo_J1K2L3suit",
      amount: 18500, status: "completed",
      customer_email: "theo.lindqvist@example.com",
      customers: { name: "Theo Lindqvist", email: "theo.lindqvist@example.com", phone: null },
      shipping_address: { line1: "9 Harbour Mews", line2: null, city: "Seattle", state: "WA", postal_code: "98101", country: "US" },
      products: { title: "Bauhaus Jumpsuit", slug: "bauhaus-jumpsuit", thumbnail: A("bauhaus-jumpsuit", "thumbnail") },
      tracking_number: null, tracking_carrier: null, shipped_at: null, tracking_email_sent_at: null,
      created_at: "2026-06-28T08:42:00Z",
    },
    /* shipped */
    {
      id: "o1000000-0006-4000-8000-000000000006", stripe_payment_intent: "pi_demo_M4N5O6shirt",
      amount: 14500, status: "shipped",
      customer_email: "devon.reyes@example.com",
      customers: { name: "Devon Reyes", email: "devon.reyes@example.com", phone: null },
      shipping_address: { line1: "27 Canalside", line2: null, city: "Brooklyn", state: "NY", postal_code: "11211", country: "US" },
      products: { title: "Barely Bauhaus Linen Shirt", slug: "glitch-art-shirt", thumbnail: A("glitch-art-shirt", "thumbnail") },
      tracking_number: "9400 9999 8888 7777 6666 55", tracking_carrier: "USPS",
      shipped_at: "2026-06-27T10:05:00Z", tracking_email_sent_at: "2026-06-27T10:05:40Z",
      created_at: "2026-06-26T18:20:00Z",
    },
  ];

  /* ----------------------------------------------------------------- COUPONS */
  const coupons = [
    {
      code: "WELCOME10", promotion_code_id: "promo_demoWELCOME", percent_off: 10, amount_off: null,
      amount_display: null, min_amount: null, min_display: null,
      times_redeemed: 7, max_redemptions: null, expires_at: null, expires_display: null,
      store_wide: true, product_ids: null,
    },
    {
      code: "ANDES25", promotion_code_id: "promo_demoANDES", percent_off: null, amount_off: 2500,
      amount_display: "$25.00", min_amount: 20000, min_display: "$200.00",
      times_redeemed: 2, max_redemptions: 25, expires_at: 1782604800, expires_display: "Jun 30",
      store_wide: false, product_ids: ["prod_peruvian-leather-bag"],
    },
  ];

  /* automatic no-code store-wide sale. null = none running. */
  const storeWideSale = {
    active: true, type: "percent", value: 20,
    amount_display: "20% off", started_at: "2026-06-20T00:00:00Z", expires_display: null,
  };

  /* ------------------------------------------------------------------ CONFIG */
  const config = { publishableKey: "pk_test_demo", isTest: true, siteUrl: "https://shop-admin.august.style" };

  /* ----------------------------------------------------------- ACTIVITY LOG */
  const activityLog = [
    { at: "2026-06-29T09:14:00Z", actor: "admin@design.shop", action: "product.publish", summary: "Published “Retro Snapback”" },
    { at: "2026-06-29T08:50:00Z", actor: "admin@design.shop", action: "order.ship", summary: "Marked “Peruvian Leather Bag” shipped" },
    { at: "2026-06-28T20:02:00Z", actor: "admin@design.shop", action: "order.refund", summary: "Refunded $145.00 on the Art Deco Poster" },
    { at: "2026-06-28T16:33:00Z", actor: "admin@design.shop", action: "product.update", summary: "Staged a charcoal colorway on “Barely Bauhaus Linen Shirt”" },
    { at: "2026-06-27T14:20:00Z", actor: "admin@design.shop", action: "sale.create", summary: "Started a 20% store-wide sale" },
    { at: "2026-06-27T11:05:00Z", actor: "admin@design.shop", action: "product.publish", summary: "Published “Bauhaus Jumpsuit”" },
    { at: "2026-06-26T19:40:00Z", actor: "admin@design.shop", action: "order.ship", summary: "Marked “Barely Bauhaus Linen Shirt” shipped" },
    { at: "2026-06-23T17:42:00Z", actor: "admin@design.shop", action: "product.publish", summary: "Published “Mid-Century Modern Tee”" },
  ];

  /* -------------------------------------------------- computed state (contract) */
  function computeState(p) {
    if (p.archived_at) return "archived";
    if (!p.is_published) return "draft";
    if (p.is_published && p.draft) return "edits";
    if (p.is_published && !p.available) return "sold";
    return "live";
  }
  function money(cents) {
    if (cents == null) return "—";
    return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  window.PORTAL_DATA = { products, orders, coupons, storeWideSale, config, activityLog, computeState, money };
})();
