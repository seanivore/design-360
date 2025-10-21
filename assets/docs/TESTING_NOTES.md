# Entry Page Local Testing Instructions

## The Problem:
Entry pages weren't testable locally because Python's http.server doesn't support 404.html routing.

## The Solution:
Use URL parameters (same strategy that made section pages work locally).

## Add to entry-controller.js parseURL() function:
```javascript
function parseURL() {
    // LOCALHOST TESTING: Check for URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const pathParam = urlParams.get('path');
    
    if (pathParam) {
        console.log(`🔍 Entry URL param: path=${pathParam}`);
        return pathParam;
    }

    // Production: Check for redirected path from 404.html
    const redirectPath = sessionStorage.getItem('entryPath');
    if (redirectPath) {
        sessionStorage.removeItem('entryPath');
        return redirectPath;
    }

    // Fallback
    return window.location.pathname.replace(/^\/|\/$/g, '');
}
```

## Test with:
```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

**Then visit:**
```
http://localhost:5500/entry.html?path=web/html-css-js/personalized-fashion-magazine
http://localhost:5500/entry.html?path=web/webflow/automated-e-commerce-shop-lookbook
http://localhost:5500/entry.html?path=web/framer/blog-lookbook-print-gallery
```

This bypasses the 404 routing need and lets you test entry pages fully before deploying! ✅