# 'webflow-store' Site Issues

## **BREAKING DOWN WHY THIS IS AN ACTUAL GLOBAL HTML BUG BECAUSE OF A LOGIC FLAW** 

Apply this logic: **write a path based on navigating based on what page you are writing the a path into HTML for, you don't write paths based on simply where the file is located**. This is obviously a very nuanced difference, but it is key. Using that logic, you can apply these rules, within which I'll show why it is a bug and why it breaks the logic, because on the surface, it seems like it maybe shouldn't matter. 

1. "/" = ROOT no matter where the page you are on is 
   - Example: If you are writing Users/seanivore/Development/dog-repo/cat/snake.html and link to a page at Users/seanivore/Development/dog-repo/index.html, you write "/index.html" 
   - **HTML LOGIC FLAW** using "./" or "/" both work when writing a path from the actual root, regardless of where the other file is. 
   - **LOGIC FLOW CONSEQUENCE** It will sometimes REQUIRE one or the other, and you will not know if it wants "./" or "/" until you try both. 
   - If there was no consequence, it might "not matter", however it becomes clear that this breaks the logic because if you're at /dog-repo/cat.html and you want to link to /dog-repo/cat/snake.html, it will not work if you add a period to the path like "./dog-repo/snake.html" even though that is the same logic the root is using by allowing "./" to work. 

2. "./" = Same directory the page you are on is in 
   - Example: If you are writing HTML page at /dog-repo/cat/snake.html and you want to link to /dog-repo/cat/rat.html, you write "./rat.html" 

3. "../" = Back Up this many directories first 
   - Example: If you are writing HTML page at /dog-repo/cat/snake.html and you want to link to /dog-repo/cat.html, you write "../cat.html" 
   - This does not apply if rule 1 applies; if rule 1 applies, you write "/index.html" or "./index.html" because of the bug consequences. 

4. "../../" = Back Up two directories  
   - This does not apply if rule 1 applies; if rule 1 applies, you write "/index.html" or "./index.html" because of the bug consequences. 

5. In all cases you can never add a '/' to the end of a path 

I presume that IDE's allow both "/" and "./" to work when writing from the root because of the consequence mentioned at number 1, otherwise they would only permit "/" to work, as the logic implies should only work. 

## Relative Path Cheat Sheet 

Write them to accommodate where you are, not where you're going. 

"/" = ROOT no matter where the page you are on is 
"./" = Same directory the page you are on is in  
"../" = Back Up this many directories first 
"../../" = Back Up two directories (if you're on a page at fashion/lookbook/ for example) 

Treat everything after that notation normally, writing the path as it is after the 'webflow-store' root directory. 

## In General, Find URLs with "index.html" Stuck in the Middle

### 'webflow-store/fashion/lookbook' --> remove "index.html/fashion/lookbook/"

- There are *MANY* more of these to find and fix; just two examples below 
- These could be anywhere, so use directions below 
- Because "file:///Users/seanivore/Development/webflow-store/" will not translate into a working hyperlink on the live site 
- Live site presumes the start of the path, which would duplicate it (Users/seanivore/Development/webflow-store)

**Bad**
file:///Users/seanivore/Development/webflow-store/fashion/lookbook/index.html/fashion/lookbook/asymmetrical-neoprene-geometric-prints-metallic-angular-silhouette-sheer

*Fixed*
file:///Users/seanivore/Development/webflow-store/fashion/lookbook/asymmetrical-neoprene-geometric-prints-metallic-angular-silhouette-sheer

**Bad**
file:///Users/seanivore/Development/webflow-store/fashion/lookbook/index.html/fashion/lookbook/flowy-wide-leg-trousers-botanical-prints-linen-drawstring-pants-corset-inspired-lacework-lightweight-duster

*Fixed*
file:///Users/seanivore/Development/webflow-store/fashion/lookbook/flowy-wide-leg-trousers-botanical-prints-linen-drawstring-pants-corset-inspired-lacework-lightweight-duster

## From Any Directory 

### FROM a page at the ROOT 

If you're at the root then both of these work. 
- "./" should be same directory 
- "/" is the root 

src="/assets/svg/youtube-white-2024.svg"
src="./assets/svg/youtube-white-2024.svg"

(**This is a logic flaw in HTML because obviously, in the example above, the youtube-white-2024.svg file is not in the root directory**)

### The ROOT NEVER gets a period (unless you're at the root **this is a logic flaw in HTML**)
- File Is Project Root = No Period, just "/" 
- Remove "./index.html" from hrefs
- Add .html to hrefs
- DO NOT PUT A "/" AT THE END

./index.html/legal-privacy-terms
/legal-privacy-terms.html

href="./index.html/"
href="/index.html"

BUT NOT --> href="/index.html/" <-- I know super weird, IDK why 

### HTML File In Same Directory 
- You're in the directory linking to a file in the same directory
- Give it a "./" 

They're both in 'fashion/lookbook' so linking from one to the other: 

./zodiac-inspired-photoshoot-images.html <----> ./classic-art-history-prints-paired-with-fashion.html

## Pages In 'webflow-store/fashion/lookbook/'

I'm finding paths with randomly placed "index.html" in them: 

href="./index.html/fashion/lookbook/classic-art-history-prints-paired-with-fashion"

This is in the same directory and is missing the .html: 

href="./classic-art-history-prints-paired-with-fashion.html"

### Anything in 'assets/*" 
- This is for a page that is two levels in = webflow-store/fashion/lookbook/
- That means the path to a different file starting at the root, that is then two levels in, is ../../
- - Also replace any files with .svg to have a /assets/svg/ prefix instead of /assets/images/

../../assets/images/1-Artboard%201.svg
/assets/svg/1-Artboard%201.svg

- A "../../" Represents How Far In From Root You Need To **Back Up**

src="../../assets/images/bau-lookbook-nav-icon-in-backdrop-400x-no-bg.webp"

### Getting To Other Sections 
- No period because not in the same directory 
- No need to name the home page first 

href="./index.html/art-movement-museum/buy-historic-prints"
href="/art-movement-museum/buy-historic-prints.html"

- Going Home? It doesn't matter how deep you are because no period "/" is the root

href="../../../index.html"
href="/index.html"

### Trend Article, Table of Contents, Cover = Same Directory, Missing .html

href="./index.html/fashion/lookbook/trend-watch-big-changes"
href="./trend-watch-big-changes.html"

href="./index.html/fashion/lookbook/summer-fall-2024-trend-table-of-contents"
href="./summer-fall-2024-trend-table-of-contents.html"

href="./fashion/lookbook/summer-2024-cover.html"
href="./summer-2024-cover.html"

### Weird One But Accurate Because It's A Modal (And no ./ Because That Is The Page You're On)

href="summer-fall-2024-trend-table-of-contents.html#takeover-email-frame-form"

## Pages In 'webflow-store/art-movement-museum"

### Anything in 'assets/*" 
- The "../" represents how far you have to **BACK UP**

src="../assets/images/fr-v2-ANUV-92002-8x10.webp"

Be sure to change any .svg files from 'assets/images' to 'assets'/svg' 

### Getting To Other Sections 
- The "../" represents how far you have to **BACK UP**

href="../understand-trends/buy-historic-artwork/original-single-edition-prints/goddess-forest-angelic-ornate-mystique-woman-face-perfection-beauty-nouvueau.html"

- Because "../" is backing up one *AND* because **ROOT IS ALWAYS "/"** both of these are functional

href="../legal-privacy-terms.html"
href="/legal-privacy-terms.html"

## CDN & Host Files That Remain 

https://cdn.prod.website-files.com/63eeb040bbd9e6ee6a1ef49e/js/webflow.fda71ad1e.js
/Users/seanivore/Development/webflow-store/assets/js/webflow.fda71ad1e.js

https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=63eeb040bbd9e6ee6a1ef49e
/Users/seanivore/Development/webflow-store/assets/jquery-3.5.1.min.dc5e7f18c8.js?site=63eeb040bbd9e6ee6a1ef49e

## JS Fixes 

They just all need the appropriate "../" prefix if you're in one level, "../../" if you're two levels in, and if you are the root, then both "./" or just "/" before "assets" works. 

```HTML
    <script async src="../assets/js/cmsnest.js"></script>
    <!-- [Attributes by Finsweet] CMS Filter -->
    <script async src="../assets/js/cmsfilter.js"></script>
    <!-- [Attributes by Finsweet] Combobox -->
    <script defer src="../assets/js/combobox.js"></script>
    <!-- [Attributes by Finsweet] List item counter -->
    <script defer src="../assets/js/countitems.js"></script>
    <!-- [Attributes by Finsweet] CMS Load -->
    <script async src="../assets/js/cmsload.js"></script>
    <!-- [Attributes by Finsweet] CMS Sort -->
    <script async src="../assets/js/cmssort.js"></script>
    <!-- [Attributes by Finsweet] Custom favicon by page -->
    <script defer src="../assets/js/favcustom.js"></script>
```