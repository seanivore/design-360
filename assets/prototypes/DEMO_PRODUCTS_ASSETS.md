# Demo Products 

**Purpose:** what images to make for each demo product (concepts + shot list), and the exact
**CDN keys** to upload them under so they line up with the URLs I bake into `data.js`.

**No marketing copy here** — you'll write/adjust that after the images exist. These are just
visual ideas; change anything, it's your creative process.

**Upload:** `POST https://www.august.style/api/upload` (file or URL + `key`), per
`ENTRY_SOP.md` §6. Every key is under `media/shop-admin/<slug>/`.

**Per product you need:** 1 hero + **5 gallery** (the publish gate wants ≥5), optional share
image + a short video. Two products are intentionally **left short / draft** to show the gate
(noted below) — don't "fix" those.

---

**Result:** I've adapted some ideas and pulled from what I had best. I just ran out of generations so I stopped short of enough prints for Art Prints type 4, which is now Industrial Brutalism. I also made videos for more than expected until I ran out of those credits faster. I used them yesterday so I should get more soon but we might have enough regardless. I want you to review and make sure everything is set before I add to CDN. TBH, agents have always done it and I never have, but I didn't both downsizing and putting them into .webp so the images should go through the UPLOAD API for sure. The videos we'll have to send straight to the CDN. I included the prompts I used because I figured it would help with copywriting. For the Art Prints, you might just have to actually look at one of each first, please. We might end up wanting to change the name of product types too, Check it out! 

---

## Art Prints — `product_type: "print"` 

### 1. Art Nouveau poster — slug `art-nouveau-poster`
- **Concept:** a single Mucha-ish Art Nouveau piece, framed, sold as a print.
- **Shots:** local file for CDN
  - `assets/.media/shop-admin/art-nouveau-poster/checkout-art-nouveau-poster.jpg`
  - `assets/.media/shop-admin/art-nouveau-poster/gallery-art-nouveau-poster-1.jpg`
  - `assets/.media/shop-admin/art-nouveau-poster/gallery-art-nouveau-poster-2.jpg`
  - `assets/.media/shop-admin/art-nouveau-poster/gallery-art-nouveau-poster-3.jpg`
  - `assets/.media/shop-admin/art-nouveau-poster/gallery-art-nouveau-poster-4.jpg`
  - `assets/.media/shop-admin/art-nouveau-poster/gallery-art-nouveau-poster-5.jpg`
  - `assets/.media/shop-admin/art-nouveau-poster/gallery-art-nouveau-poster-6.jpg`
  - `assets/.media/shop-admin/art-nouveau-poster/hero-art-nouveau-poster.jpg`
  - `assets/.media/shop-admin/art-nouveau-poster/thumbnail-art-nouveau-poster.jpg`

### 2. Art Deco poster — slug `art-deco-poster`
- **Concept:** bold geometric Deco piece, framed.
- **Shots:** local file for CDN
  - `assets/.media/shop-admin/art-deco-poster/checkout-art-deco-poster.jpg`
  - `assets/.media/shop-admin/art-deco-poster/gallery-art-deco-poster-1.jpg`
  - `assets/.media/shop-admin/art-deco-poster/gallery-art-deco-poster-2.jpg`
  - `assets/.media/shop-admin/art-deco-poster/gallery-art-deco-poster-3.jpg`
  - `assets/.media/shop-admin/art-deco-poster/gallery-art-deco-poster-4.jpg`
  - `assets/.media/shop-admin/art-deco-poster/gallery-art-deco-poster-5.jpg`
  - `assets/.media/shop-admin/art-deco-poster/gallery-art-deco-poster-6.jpg`
  - `assets/.media/shop-admin/art-deco-poster/hero-art-deco-poster.jpg`
  - `assets/.media/shop-admin/art-deco-poster/thumbnail-art-deco-poster.jpg`

### 3. Bauhaus poster — slug `bauhaus-poster`
- **Concept:** primary-color(-ish) Bauhaus composition, framed.
- **Shots:** local file for CDN
  - `assets/.media/shop-admin/bauhaus-poster/checkout-bauhaus-poster.jpg`
  - `assets/.media/shop-admin/bauhaus-poster/gallery-bauhaus-poster-1.jpg`
  - `assets/.media/shop-admin/bauhaus-poster/gallery-bauhaus-poster-2.jpg`
  - `assets/.media/shop-admin/bauhaus-poster/gallery-bauhaus-poster-3.jpg`
  - `assets/.media/shop-admin/bauhaus-poster/gallery-bauhaus-poster-4.jpg`
  - `assets/.media/shop-admin/bauhaus-poster/gallery-bauhaus-poster-5.jpg`
  - `assets/.media/shop-admin/bauhaus-poster/gallery-bauhaus-poster-6.jpg`
  - `assets/.media/shop-admin/bauhaus-poster/hero-bauhaus-poster.jpg`
  - `assets/.media/shop-admin/bauhaus-poster/thumbnail-bauhaus-poster.jpg`

### 4. Industrial Brutalism — slug `industrial-brutalism` *draft; not enough prints*
- **Concept:** A collection of geometric and textured photographs capturing the raw and imposing beauty of industrial architecture.
- **Shots:** local file for CDN
  - `assets/.media/shop-admin/industrial-brutalism/checkout-industrial-brutalism.jpg`
  - `assets/.media/shop-admin/industrial-brutalism/gallery-industrial-brutalism-1.jpg`
  - `assets/.media/shop-admin/industrial-brutalism/gallery-industrial-brutalism-2.jpg`
  - `assets/.media/shop-admin/industrial-brutalism/gallery-industrial-brutalism-3.jpg`
  - `assets/.media/shop-admin/industrial-brutalism/hero-industrial-brutalism.jpg`
  - `assets/.media/shop-admin/industrial-brutalism/thumbnail-industrial-brutalism.jpg`

---

## Apparel — `product_type: "apparel"`

### 5. Graphic tee — slug `mid-modern-tee`
- **Concept:** Mid-century modern art prints applied to every inch of these cotton t-shirts, featuring two styles of fits with two different art prints
- **Shots:** local file for CDN; note, video cannot go through upload API yet.
  - `assets/.media/shop-admin/mid-modern-tee/checkout-mid-modern-tee.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/gallery-mid-modern-tee-1.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/gallery-mid-modern-tee-2.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/gallery-mid-modern-tee-3.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/gallery-mid-modern-tee-4.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/gallery-mid-modern-tee-5.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/gallery-mid-modern-tee-6.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/gallery-mid-modern-tee-7.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/hero-mid-modern-tee.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/poster-mid-modern-tee.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/thumbnail-mid-modern-tee.jpg`
  - `assets/.media/shop-admin/mid-modern-tee/video-mid-modern-tee.mp4`
- **Prompts:** for record-keeping and copywriting inspiration. 
    ```
    Male athletic swimwear model in his young-20s; he is urban, a tall pacific asian islander who has lean, toned swimmer-muscle body; urban aesthetic, he is wearing the attached mid-century modern pattern that is a printed-all-over fitted cotton tee. The print literally covers every inch of the t-shirt making for an interesting contrast to the concrete jungle he stands in with whimsical but futuristic graffiti on the walls behind him. He has medium-long hair, fairly blonde, a tiny bit wavey and a tiny bit messy. The vibrant shift is tailored, cropped to almost perfectly reach the top of his high waisted, wide leg, camel corduroy trousers. He is all smiles, having just got done a skateboard and photography session with is off camera friends. The images are on top of a parking garage and twilight and they are dynamic, he is twisting and jumping almost like parkour; on his arms and any exposed skin you can see he is covered in black and gray floral tattoos. The feeling is energetic but sensual. 

    Female yoga swimwear model in her young-20s; she is urban, a tall dark skinned woman who is slim but toned, with an urban punk skateboarder aesthetic, she is wearing the attached mid-century modern pattern that is a printed-all-over fitted cotton tee. The print literally covers every inch of the t-shirt making for an interesting contrast to the concrete jungle she stands in with whimsical but futuristic graffiti on the walls behind her. She has short-medium brown hair, very wavy, with an added color dyed chunk of super-vibrant blue. The vibrant shirt was carefully tailored, sleeves removed, and cropped just a couple inches above her high waisted, dark brown leather trousers. She is angsty with a sly smile, having just finished a skateboarding and photography session with her off camera friends. The images are on top of a parking garage at twilight and they are dynamic, as she is climbing and balancing up high on walls and cars, showing off; on her wrists and fingers she is wearing very unique, intricate silver and gold jewelry and a chunky, layered necklace to match. 

    Two fitted, tailored t-shirts with one of either of these two mid-century modern patterns attached, printed-all-over the cotton tee. The print literally covers every inch of the t-shirt. The shirts thrown down carelessly on the cement table, just draped messily, with lots of scrunching of the shirt, but the pattern looks perfect printed and curved through the random folds and scrunched curves making it very clear it is on th shirt, without the shirt needing to lay flat at all. On the table with the tossled tees are two pair of vintage small round circle lens sunglasses with metal frames, two old fashioned cocktails, garnished, and with gold metal straws, very Silver Lake Los Angeles California hipster. Next to the cement table is a brick wall with white fencing on top where pink bougainvillea bushes have overgrown with flowers and petals everywhere. 

    fashion clip focused on the mid-century modern patterns cotton tee she is wearing; the camera is completely still as she slowly adjusts her pose and climbs down from off the car. She smiles with dreamy eyes at the camera. The feeling is confident desire.
    ```

### 6. Graphic shirt — slug `glitch-art-shirt`
- **Concept:** 'Barely Bauhaus' glitch art prints applied to every inch of these textured white natural linen dress shirts; one sized for men, and the other made extra long to be worn as a dress, for women. 
- **Shots:** local files to upload to CDN; still can create video. 
  - `assets/.media/shop-admin/glitch-art-shirt/checkout-glitch-art-shirt.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/gallery-glitch-art-shirt-1.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/gallery-glitch-art-shirt-2.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/gallery-glitch-art-shirt-3.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/gallery-glitch-art-shirt-4.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/gallery-glitch-art-shirt-5.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/gallery-glitch-art-shirt-6.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/gallery-glitch-art-shirt-7.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/gallery-glitch-art-shirt-8.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/gallery-glitch-art-shirt-9.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/hero-glitch-art-shirt.jpg`
  - `assets/.media/shop-admin/glitch-art-shirt/thumbnail-glitch-art-shirt.jpg`
- **Prompts:** for record-keeping and copywriting inspiration. 
    ```
    Male fashion model in his young-20s; he is slim, sharp jawline and high cheekbones, european with medium short blond neatly placed old-money styled hair; he is wearing the attached 'barely bauhaus' glitch art pattern that is printed-all-over his textured white natural linen dress shirt. The print literally covers every inch of the shirt, from collar to cuff, only but buttons are gold. He wears the dress shirt with the bottom few and top few buttons undone, the bottom of the shirt just barely grazing the top of his high waisted, wide legged shear natural white linen trousers; these are paired with brown leather boots and many, very intricate gold rings, and two black diamond stud earrings mounted in gold. He wears glasses that are black and gold framed antique, and he has the sleeves of his patterned dress shirt are folded up a few cuffs and you can see his black and gray floral sleeve tattoos. This attire is perfect for the after hours party at the penthouse rooftop in NYC. He holds his glass of champagne up for it is almost new years eve, as he gazes with a sensual smirk into the camera. 

    Female runway model, high fashion, very vogue, european, young-20s, tall and blonde with medium long straight hair she currently has down, fitting with her long gold and diamond dangling earrings and massive tiered gold and diamond necklace. She has strong features with sharp jaw and high cheekbones where she rests antique black and gold glasses. She is wearing the attached 'barely bauhaus' glitch art pattern that is printed-all-over her textured white natural linen, extra long, dress shirt style dress, tied with very thin brown belt with gold embellishments that loops around her high waist twice to cinch in the long button-front dress that only comes within inches of her mid-thigh. She has the top few buttons and bottom few buttons undone, and black lace can be seen underneath, above, and below you can see the bottom of black and gray floral tattoos she has completely covering her upper and lower thigh, down to the back of one of her calves; she is wearing stiletto heels that are flat white. In her hand, which is wearing a great many very unique and intricate gold and diamond encrusted rings, she is raising up her glass of champagne as it is almost midnight on NYE. Her attire is perfect for the after hours part at the penthouse rooftop in NYC. She look into the camera like she is thinking about seducing it before smirking and looking away with an eye roll. 

    In a penthouse, just off from the living room where there's a sage mid-century modern sofa and floor to ceiling windows, the large french doors to a bedroom are both open. Inside you can see there is a rack of clothing and hanging on hangers are two garments. The first is a tailored mens dress shirt in the first attached 'barely bauhaus' glitch art pattern, with the print literally covering every inch of the shirt from collar to cuffs, and with gold buttons lay ruffled, the print mapping around the curves and folds of the white textured linen fabric perfectly, and next to it is a woman's dress shirt designed extra long to be worn as a dress, also covered, but this time with the second attached 'barely bauhaus' glitch art pattern, completely covering the same kind of textured white linen fabric. 

    fashion clip focused on the 'barely bauhaus' glitch art patterned extra long white textured linen dress shirt for women worn as a dress; the camera is completely still as she flirts with the person behind the lens, smiling in a slightly seductive way before rolling her eyes and looking away.
    ```

### 7. Graphic jumpsuit — slug `bauhaus-jumpsuit`
- **Concept:** Jumpsuits for work and cold temperatures with every single inch covered in original 'Bauhaus' geometric abstractionism artwork. Four different patters are featured in the photo series.
- **Shots:** local file for CDN.
  - `assets/.media/shop-admin/bauhaus-jumpsuit/checkout-bauhaus-jumpsuit.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-1.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-2.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-3.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-4.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-5.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-6.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-7.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-8.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-9.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-10.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/gallery-bauhaus-jumpsuit-11.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/hero-bauhaus-jumpsuit.jpg`
  - `assets/.media/shop-admin/bauhaus-jumpsuit/thumbnail-bauhaus-jumpsuit.jpg`
- **Prompts:** for record-keeping and copywriting inspiration. 
    ```
    Male model, athletic, swimwear, underwear model in his young-20s has a very carefully sculpted physique that is muscular but careful not to be too muscular. He is rugged, eastern european, with good bone structure, dark brown short, messy, a little bit curly, hair, and scruffy face and body hair. He is wearing heavy dark brown leather boots, and a jumpsuit with the upper half left off, hanging by the brown worn leather belt at his waist. The jumpsuit, made of natural fibers, has the attached 'bauhaus' geometric abstractions pattern that is printed-all-over on the outside, and the inside is lined with white rabbit fur. The print literally covers every inch of the outside of the jumpsuit other than the white zipper. The model is standing on the wooden front deck with the two giant sliding glass french doors open, on his modern glass home build out in the snow-covered rural lands of Iceland. Inside you can see a modern fireplace roaring with flames near the entrance, where there are two mid-century modern sofas and a bearskin rug. In the distance in the open layout home you can see a modern kitchen, wooden bookshelves in an office space and bar, and open step stairs going up to a loft. The man is still holding his skis in one hand, and a coffee mug in the other, as the first light of morning shines across the reflective landscape. 

    Male model, streetwear, fashion, catalog, underwear model in his mid-20s has a muscular but smaller physique, very toned and lean like a distance swimmer. He is very tall, from the west coast of the states, and has excellent bone structure, high cheekbones, a clean shaven face, short, neat, light brown hair; he is very carefully groomed, has some body hair. After skiing and shoveling all day, he came back home to his modern, all glass, Icelandic home where he stands on the front deck with the large glass doors open, still holding his snow shovel in one hand. He is wearing light brown chunky boots, and a jumpsuit with the upper half left off, hanging by the white leather belt riding very low on his waist so that the tops of his pale salmon colored-waffle-textured long underwear bottoms show the elastic waistband pulling tight around just below his hip bones. The jumpsuit, made of natural fibers, has the attached 'bauhaus' geometric abstractions pattern that is printed-all-over on the outside, and the inside is brown rabbit fur. The print literally covers every inch of the outside of the jumpsuit other than the golden buttons. In the model's other hand he is holding a coffee mug, and behind him you can see he has a grand hearth and mantle of white marble and reclaimed wood. You can see a black metal spiral staircase going up to a loft in the a-frame glass house. There is tastefully decorated mid-century furniture and a polar bear-skin rug by the fire, and in the distance a den and a modern kitchen. As the model takes in the fresh, cold air after a long day of work, the light is perfectly magic hour, and the scene feels like cozy, sensual, escapism. 

    Two male models. Fashion. Swimwear. Underwear. Athletic models. The first model is more muscular, young-20s, rugged, eastern european, strong structure, dark brown short, messy, a little bit curly, hair, body hair, and a scruffy face. He wears heavy dark brown leather boots, brown leather belt, and a natural fiber jumpsuit with the first attachment "bauhaus" geometric abstraction pattern printed-all-over the outside of the suit, every inch, with brown rabbit fur inside lining. The second model is more lean and toned with a swimmer's body, very tall, mid-20s, from the west coast of the united states, has high cheekbones and a sharp jawline, keeps a clean shaven face, slight body hair, and has very neatly groomed short dirty blonde hair. He is wearing light brown chunky boots, white leather belt at the waist, and his jumpsuit is printed-all-over but with the second 'bauhaus' attachment pattern and white rabbit hair insulation. The two models stand on the deck of their modern, all glass, Icelandic home with the two large sliding front doors open to the deck, and a large fire in the white stone hearth fireplace just inside where there is a bearskin rug and a mid-century modern sofa. The sun is starting to go down and it is magic hour. The men are exhausted from shoveling all around the home. The second model brought a coffee out to the first model who now has unzippered the top half of the jumpsuit and it hangs at his waist, he pauses to enjoy the coffee, the elastic waistband of his flannel-boxers on his hips. The second model, also overheated, has undone the gold buttons down the upper top of his jumpsuit, pausing only when he reached his pale blue waffle-texture long johns. As they breathe in the cold fresh air after the long day of work, that magic hour lighting creating long, soft shadows and giving the scene a warm hue. 
    ```

---

## Merch — `product_type: "merch"`

### 8. Leather bags — slug `peruvian-leather-bag`
- **Concept:** series of hand crafted, soft Peruvian leather bags with dark, pressed embroidered details and intricate beading; featuring a cross body bag and a backpack.
- **Shots:** local file for CDN; note, video cannot go through upload API yet.
  - `assets/.media/shop-admin/peruvian-leather-bag/checkout-peruvian-leather-bag.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/gallery-peruvian-leather-bag-1.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/gallery-peruvian-leather-bag-2.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/gallery-peruvian-leather-bag-3.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/gallery-peruvian-leather-bag-4.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/gallery-peruvian-leather-bag-5.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/gallery-peruvian-leather-bag-6.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/hero-peruvian-leather-bag.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/poster-peruvian-leather-bag.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/thumbnail-peruvian-leather-bag.jpg`
  - `assets/.media/shop-admin/peruvian-leather-bag/video-peruvian-leather-bag.mp4`
- **Prompts:** for record-keeping and copywriting inspiration. 
    ```
    Male model, young-20s, columbian, very tall, dark, large biceps, wearing a tattered pale purple muscle tank that is faded and well worn, with the arms stretched wide, hanging down low showing his upper rib on his torso. The shrunken tank, slightly wet from the waterfall behind him, is cropped a centimeter or two short above his beige rough linen 5" inseam shorts that only reach to the middle of thighs that rival the size of his biceps. On his feet are jungle-ready thin leather strapped sandals wrapped snug to his feet to keep him on the trail through the brush. Mist from the falls have his face dripping in the heat; as he hikes, hand full of intricate silver rings holding the strap of a crossbody bag made in Peru of woven soft leather that is deeply embroidered with dark impressions making intricate patterns on the leather that is then stitched with fine, vibrant beading. He has a sharp jawline and jet black buzzed hair, and under his piercing eyes he has a silver septum nose ring. His gaze into the camera isn't necessarily smiling though he does look like the kind of fun trouble that kind of magnetic mysterious character might reveal.

    Female model, young-20s, pale skin and slender build would seem slightly out of place by the waterfall in the jungle, if not for her knowing gaze, long dirty blonde hair messily held up by braids and colorful cotton cords. She has on simple leather sandals beneath wide leg, high waisted, cream colored rough natural linen textured trousers, with a simple dark but iridescent bikini top, having recently emerged from the deep blue waters below the falls. Around her neck and on her ears hang very fine, thin golden chain jewelry making a sort of chainmail necklace front; matching her many thin gold rings up the side of her ear cartilage. She carries a hiking backpack that was handmade in Peru from soft leather the was embroidered deeply with dark, intricate patterns. The strap on her shoulder is completely covered in very fine, vibrant beading; impressive high fashion work to find out in the jungle. She walks towards the camera pushing locks of her hair out of her face, looking very serious, but also vital, full of energy and adventure and mystery. 

    High-detail macro photography of the peruvian leather bags, embroidered with dark impressed intricate patterns and covered with very fine, vibrant beading; a crossbody bag of woven soft leather; a handcrafted leather backpack with beaded patterns covering the straps. Both very natural, organic, from the jungle, and also very high fashion, craftsman, luxury. The bags sit on the earth on a thick llama hair handmade rug, piled with other rugs and also heavy woolen thick knitted sweaters folded nicely beside fine gold and crystal and glass bowls and heavy dark wooden stands all holding piles of chunky silver and gold jewelry covered with jade and ruby and sapphires, some of the largest gemstones anywhere. And then resting in front of the bags are thin linen scarfs with geometric patterns upon which set multiple pairs of vintage small round polarized circular lens glasses with very thin woven silver wire frames. This is a perfectly curated fashion photography still life, where the subjects of the imagery are the peruvian leather embroidered bags, one cross body and the other a simple backpack. 

    fashion clip focused on the embroidered leather cross body bag; the camera almost completely still, just very slowly moving backwards and down lower to the ground as the male model, mid-20s walks confidently and paced like a jungle cat towards the camera; intense eyes into the camera; a look not of pride but of power and mystery; the feeling is unafraid and without ego; it is a cinematic moment full of suspense
    ```

### 9. Snapback caps — slug `retro-snapback`
- **Concept:** a dark charcoal natural gray fiber snapback with a print of a classic 3.5" floppy disk that has black sharpie on its label, scrawling 'CLAUDE CODE' or 'CHAT GPT'.
- **Shots:** local file for CDN; note, video cannot go through upload API yet. 
  - `assets/.media/shop-admin/retro-snapback/checkout-retro-snapback.jpg`
  - `assets/.media/shop-admin/retro-snapback/gallery-retro-snapback-1.jpg`
  - `assets/.media/shop-admin/retro-snapback/gallery-retro-snapback-2.jpg`
  - `assets/.media/shop-admin/retro-snapback/gallery-retro-snapback-3.jpg`
  - `assets/.media/shop-admin/retro-snapback/gallery-retro-snapback-4.jpg`
  - `assets/.media/shop-admin/retro-snapback/gallery-retro-snapback-5.jpg`
  - `assets/.media/shop-admin/retro-snapback/gallery-retro-snapback-6.jpg`
  - `assets/.media/shop-admin/retro-snapback/hero-retro-snapback.jpg`
  - `assets/.media/shop-admin/retro-snapback/poster-retro-snapback.png`
  - `assets/.media/shop-admin/retro-snapback/thumbnail-retro-snapback.jpg`
  - `assets/.media/shop-admin/retro-snapback/video-retro-snapback.mp4`
- **Prompts:** for record-keeping and copywriting inspiration. 
    ```
    Male model, young-20s, muscular, wearing circular round lens sunglasses that have black tint and gold wire frame, his jawline is rugged and he has dark stubble and beachy hair. He is wearing a fitted white natural linen textured short sleeved dress shirt, that is cropped a half an inch above his natural linen sage dyed wide leg trousers. The bottom two buttons of the shirt are undone and the same for the upper few buttons. He carries a worn brown leather satchel that looks like it was a unique, hard to find piece. His gave is playful as he looks back towards the camera giving us a clear view of the snapback hat showing a print of a 3.5" classic floppy disk that looks aesthetically blended to the dark charcoal gray natural fibers of the handmade, high fashion, cap with impeccable stitching; black sharpie script written on the disk label says CLAUDE CODE — the visual on the hat looks very well done and you can see the curved of the hat and print naturally curving with the shape of it as the camera zooms in for an upper third portrait. His look is effortlessly iconic, ironic, and the kind of fashionable guy everyone wants; humorous and intellectual, probably traveling abroad

    Female model, young 20s, yoga fit, wearing gold rings, earrings, chain necklaces, and gold thin metal frame circular round dark purple tinted lens vintage sunglasses. Her natural linen textured cream colored dress shirt has cropped off sleeves and cropped around mid abdomen. Her skin is dark olive mediterranean and her hair is curly, dark and thick underneath the handmade, impeccably stitched, snapback hat, sort of masculine that contrasts with her feminine charm. As she looks deep down and into the lens of the camera we get a clear view of the cap's print of a 3.5" classic floppy disk that looks aesthetically blended to the dark charcoal gray natural fibers of the hat with black sharpie script written on the disk label says CHAT GPT — visual on the hat looks very well done and you can see the curved of the hat and print naturally curving with the shape of it as the camera zooms in for an upper third portrait. She is carrying a very small worn brown leather clutch with gold embellishments, her rings are intricate and full of gemstones. The look is somehow both incredibly high fashion and effortlessly girl next door; she is iconic, ironic, and the kind of fashionable but playful, intellectual woman everyone wants

    Detail macro shot of a snapback hat showing a print of a 3.5" classic floppy disk that looks aesthetically blended to the dark charcoal gray natural fibers of the handmade, high fashion, cap with impeccable stitching; black sharpie script written on the disk label says CHAT GPT — the visual on the hat looks very well done and you can see the curved of the hat and print naturally curving with the shape of it. It would be worn by someone hip with an effortlessly high fashion yet casual next door look. Interesting angles and dynamic lighting play on the still life scene of clothing resting on antique mid-century modern heywood wakefield desk; lots of patterns and natural textures rest over the back of the chair complimenting the hat as the subject of the photograph

    fashion clip focused on the snapback hat. the camera moves slowly back zooming out of the close up just until his upper third is visible; the model only glances as the camera initially then, looking smart and a bit playful, the rugged, muscular mid-20s male model continues walking on his way. the motion is slow and he barely gets to the left fourth of the frame. it is cinematic and enigmatic of the casual high fashion  guy next door hunk look. the lighting is perfect magic hour. the feeling is confidence
    ```

---

## Quick checklist

- [ ] 7 products fully shot (hero + 5 gallery): prints 1–3, tees 01–03, backpack, snapback
- [ ] 1 print (`ukiyo-e-print`) short on purpose (hero + 3) → stays draft
- [ ] (optional) one tee video (`vid-graphic-tee-01.mp4`)
- [ ] all uploaded under `media/shop-admin/<slug>/…` with the keys above
- [ ] ping me when assets are up — I'll confirm they resolve and finalize the build

*(Copy — titles, story, materials, etc. — comes after, once you see the images. Easy then.)*

**NOTE**: All done more than expected, though different topics. Only CDN remains. 