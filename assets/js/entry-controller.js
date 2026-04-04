/**
 * ENTRY CONTROLLER (v5.1)
 * Manages individual project entry pages
 * Media components: hero, thumb grid + lightbox, GIFs, image grid, multi-slideshow
 */

const EntryController = (() => {

    // Lightbox state
    let lightboxImages = [];
    let lightboxIndex = 0;

    /**
     * Get entry path from URL or sessionStorage
     */
    function getEntryPath() {
        const urlParams = new URLSearchParams(window.location.search);
        const pathParam = urlParams.get('path');
        if (pathParam) return pathParam;

        const storedPath = sessionStorage.getItem('entryPath');
        if (storedPath) {
            sessionStorage.removeItem('entryPath');
            return storedPath.replace(/^\//, '');
        }

        return window.location.pathname.replace(/^\/|\/$/g, '');
    }

    /**
     * Load entry data from manifest
     */
    async function loadEntryData(entryPath) {
        const manifest = await DataLoader.loadManifest();
        const jsonPath = manifest.entries[entryPath];
        if (!jsonPath) {
            console.error('Entry not found in manifest:', entryPath);
            return null;
        }
        return await DataLoader.loadProject(jsonPath);
    }

    /**
     * Resolve image URL (CDN or relative)
     */
    function imgSrc(url) {
        return url.startsWith('http') ? url : '/' + url;
    }

    /**
     * Populate page metadata (SEO tags)
     */
    function populateMetadata(project) {
        document.title = project.seo_title || project.title;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', project.seo_description || '');

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', project.seo_title || project.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', project.seo_description || '');

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && project.thumb && project.thumb[0]) {
            ogImage.setAttribute('content', imgSrc(project.thumb[0]));
        }

        const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
        if (ogImageAlt) ogImageAlt.setAttribute('content', project.thumb_alt || project.title);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', `https://august.style/${project.slug}`);
    }

    /**
     * Populate tag pills grouped by type
     */
    function populateTagsCards(project) {
        const roles = project.role || [];
        const skills = project.skill || [];
        const products = project.product || [];

        document.querySelectorAll('.entry-tags-card').forEach(container => {
            let html = '';

            if (roles.length > 0) {
                html += '<div class="tag-pill-group tag-pill-group-role">';
                html += roles.map(tag => {
                    const tagURL = `/section.html?tags=${DataLoader.normalizeForURL(tag)}`;
                    return `<a href="${tagURL}" class="entry-tag entry-tag-role">${tag}</a>`;
                }).join('');
                html += '</div>';
            }

            if (skills.length > 0) {
                html += '<div class="tag-pill-group tag-pill-group-skill">';
                html += skills.map(tag => {
                    const tagURL = `/section.html?tags=${DataLoader.normalizeForURL(tag)}`;
                    return `<a href="${tagURL}" class="entry-tag entry-tag-skill">${tag}</a>`;
                }).join('');
                html += '</div>';
            }

            if (products.length > 0) {
                html += '<div class="tag-pill-group tag-pill-group-product">';
                html += products.map(tag => {
                    const tagURL = `/section.html?tags=${DataLoader.normalizeForURL(tag)}`;
                    return `<a href="${tagURL}" class="entry-tag entry-tag-product">${tag}</a>`;
                }).join('');
                html += '</div>';
            }

            container.innerHTML = html;
        });
    }

    /**
     * Populate hero section: video embed (priority) or random thumbnail
     */
    function populateHero(project) {
        const container = document.getElementById('entry-hero');
        if (!container) return;

        if (project.media_embed) {
            container.innerHTML = `<div class="video-container">${project.media_embed}</div>`;
            container.style.display = 'block';
        } else if (project.thumb && project.thumb.length > 0) {
            const randomThumb = project.thumb[Math.floor(Math.random() * project.thumb.length)];
            container.innerHTML = `<img src="${imgSrc(randomThumb)}" alt="${project.thumb_alt || project.title}" class="entry-hero-image" loading="eager">`;
            container.style.display = 'block';
        }
    }

    /**
     * Populate compact 2-column thumbnail grid with lightbox triggers
     */
    function populateThumbGrid(project) {
        const container = document.getElementById('entry-thumb-grid');
        if (!container || !project.thumb || project.thumb.length === 0) return;

        const shuffled = DataLoader.shuffleArray([...project.thumb]);
        const altText = project.thumb_alt || 'Project image';

        // Store for lightbox
        lightboxImages = shuffled.map(url => imgSrc(url));

        container.innerHTML = shuffled.map((img, i) => `
            <img src="${imgSrc(img)}" alt="${altText}" class="entry-thumb" loading="lazy" data-lightbox-index="${i}">
        `).join('');

        // Lightbox click handlers
        container.querySelectorAll('.entry-thumb').forEach(el => {
            el.addEventListener('click', () => {
                openLightbox(parseInt(el.dataset.lightboxIndex));
            });
        });
    }

    /**
     * Populate GIFs section
     */
    function populateGifs(project) {
        const container = document.getElementById('entry-gifs');
        if (!container || !project.gif || project.gif.length === 0) return;

        const altText = project.gif_alt || 'Project animation';
        container.innerHTML = project.gif.map(url => `
            <img src="${imgSrc(url)}" alt="${altText}" class="entry-gif" loading="lazy">
        `).join('');
        container.style.display = 'block';
    }

    /**
     * Populate 3-across square image grid
     */
    function populateImageGrid(project) {
        const container = document.getElementById('entry-image-grid');
        if (!container || !project.grid || project.grid.length === 0) return;

        const altText = project.grid_alt || 'Project image';
        container.innerHTML = project.grid.map(url => `
            <img src="${imgSrc(url)}" alt="${altText}" class="entry-grid-image" loading="lazy">
        `).join('');
        container.style.display = 'grid';
    }

    /**
     * Populate multiple slideshows from slideshows array
     */
    function populateSlideshows(project) {
        const container = document.getElementById('entry-slideshows');
        if (!container) return;

        let groups = project.slideshows || [];

        // Legacy fallback: if mobile_img exists but no slideshows
        if (groups.length === 0 && project.mobile_img && project.mobile_img.length > 0) {
            groups = [{
                title: 'Mobile Screenshots',
                type: 'mobile',
                images: project.mobile_img,
                alt: project.mobile_img_alt || 'Mobile screenshot'
            }];
        }

        if (groups.length === 0) return;

        container.innerHTML = '';
        groups.forEach((group, groupIndex) => {
            const slideshowEl = buildSlideshow(group, groupIndex);
            container.appendChild(slideshowEl);
        });
        container.style.display = 'block';
    }

    /**
     * Build a single slideshow instance
     */
    function buildSlideshow(group, groupIndex) {
        const wrapper = document.createElement('div');
        wrapper.className = 'slideshow-group';

        // Title
        if (group.title) {
            const heading = document.createElement('h4');
            heading.className = 'slideshow-title';
            heading.textContent = group.title;
            wrapper.appendChild(heading);
        }

        const isMobile = group.type === 'mobile';
        const images = group.images || [];
        if (images.length === 0) return wrapper;

        // Build slides: mobile shows 2-3 per slide, standard shows 1
        const slides = [];
        if (isMobile) {
            const perSlide = images.length <= 4 ? 2 : 3;
            for (let i = 0; i < images.length; i += perSlide) {
                slides.push(images.slice(i, i + perSlide));
            }
        } else {
            images.forEach(img => slides.push([img]));
        }

        // Slideshow container
        const slideshow = document.createElement('div');
        slideshow.className = 'slideshow';
        slideshow.dataset.groupIndex = groupIndex;

        // Main display
        const display = document.createElement('div');
        display.className = `slideshow-display ${isMobile ? 'slideshow-display-mobile' : ''}`;
        slideshow.appendChild(display);

        // Render first slide
        renderSlide(display, slides[0], group.alt || '', isMobile);

        // Navigation (only if multiple slides)
        if (slides.length > 1) {
            // Arrows
            const prevBtn = document.createElement('button');
            prevBtn.className = 'slideshow-arrow slideshow-prev';
            prevBtn.innerHTML = '&lsaquo;';
            prevBtn.setAttribute('aria-label', 'Previous slide');
            slideshow.appendChild(prevBtn);

            const nextBtn = document.createElement('button');
            nextBtn.className = 'slideshow-arrow slideshow-next';
            nextBtn.innerHTML = '&rsaquo;';
            nextBtn.setAttribute('aria-label', 'Next slide');
            slideshow.appendChild(nextBtn);

            // Counter
            const counter = document.createElement('span');
            counter.className = 'slideshow-counter';
            counter.textContent = `1 / ${slides.length}`;
            slideshow.appendChild(counter);

            // Thumbnail strip
            const strip = document.createElement('div');
            strip.className = 'slideshow-strip';
            slides.forEach((slide, i) => {
                const thumb = document.createElement('img');
                thumb.src = imgSrc(slide[0]);
                thumb.alt = group.alt || '';
                thumb.className = `slideshow-strip-thumb ${i === 0 ? 'active' : ''}`;
                thumb.loading = 'lazy';
                thumb.addEventListener('click', () => goToSlide(i));
                strip.appendChild(thumb);
            });
            slideshow.appendChild(strip);

            // State
            let currentSlide = 0;

            function goToSlide(index) {
                currentSlide = index;
                renderSlide(display, slides[index], group.alt || '', isMobile);
                counter.textContent = `${index + 1} / ${slides.length}`;
                strip.querySelectorAll('.slideshow-strip-thumb').forEach((t, i) => {
                    t.classList.toggle('active', i === index);
                });
                // Scroll active thumb into view
                const activeThumb = strip.querySelector('.active');
                if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }

            prevBtn.addEventListener('click', () => goToSlide((currentSlide - 1 + slides.length) % slides.length));
            nextBtn.addEventListener('click', () => goToSlide((currentSlide + 1) % slides.length));

            // Swipe support
            let startX = 0;
            display.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
            display.addEventListener('touchend', e => {
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    goToSlide(diff > 0
                        ? (currentSlide + 1) % slides.length
                        : (currentSlide - 1 + slides.length) % slides.length);
                }
            }, { passive: true });
        }

        wrapper.appendChild(slideshow);
        return wrapper;
    }

    /**
     * Render a single slide's content into the display area
     */
    function renderSlide(display, imageUrls, altText, isMobile) {
        display.innerHTML = imageUrls.map(url => `
            <img src="${imgSrc(url)}" alt="${altText}" class="slideshow-image ${isMobile ? 'slideshow-image-mobile' : ''}" loading="lazy">
        `).join('');
    }

    /**
     * Lightbox: open, close, navigate
     */
    function openLightbox(index) {
        lightboxIndex = index;
        const overlay = document.getElementById('lightbox-overlay');
        const img = overlay.querySelector('.lightbox-img');
        const counter = overlay.querySelector('.lightbox-counter');

        img.src = lightboxImages[index];
        counter.textContent = `${index + 1} / ${lightboxImages.length}`;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        document.getElementById('lightbox-overlay').style.display = 'none';
        document.body.style.overflow = '';
    }

    function lightboxNav(dir) {
        lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
        const overlay = document.getElementById('lightbox-overlay');
        overlay.querySelector('.lightbox-img').src = lightboxImages[lightboxIndex];
        overlay.querySelector('.lightbox-counter').textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    }

    function initLightbox() {
        const overlay = document.getElementById('lightbox-overlay');
        if (!overlay) return;

        overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        overlay.querySelector('.lightbox-prev').addEventListener('click', () => lightboxNav(-1));
        overlay.querySelector('.lightbox-next').addEventListener('click', () => lightboxNav(1));
        overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });

        document.addEventListener('keydown', e => {
            if (overlay.style.display === 'none') return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxNav(-1);
            if (e.key === 'ArrowRight') lightboxNav(1);
        });
    }

    /**
     * Populate project URL
     */
    function populateProjectURL(project) {
        const container = document.getElementById('entry-project-url');
        if (!container || !project.origin_url) return;

        container.innerHTML = `
            <a href="${project.origin_url}" target="_blank" rel="noopener noreferrer" class="project-link-card">
                <span class="link-icon">&#128279;</span>
                <span class="link-url">${project.origin_url_text || project.origin_url}</span>
            </a>
        `;
        container.style.display = 'block';
    }

    /**
     * Populate GitHub repository
     */
    function populateGitHubRepo(url) {
        const container = document.getElementById('entry-github-repo');
        if (!container) return;

        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        const repoName = match ? `${match[1]}/${match[2]}` : url;

        container.innerHTML = `
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="github-repo-card">
                <svg class="github-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span class="repo-name">${repoName}</span>
            </a>
        `;
        container.style.display = 'block';
    }

    /**
     * Generate related posts using 6-hour time-seeded random
     */
    function generateRelatedPosts(currentProject, allProjects) {
        const otherProjects = allProjects.filter(p => p.id !== currentProject.id);
        if (otherProjects.length === 0) return [];

        const timeSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 6));
        function seededRandom(seed) {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        }

        return otherProjects
            .map((project, index) => ({ project, score: seededRandom(timeSeed + index) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(item => item.project);
    }

    /**
     * Populate related posts section
     */
    async function populateRelatedPosts(currentProject) {
        const container = document.getElementById('related-posts-grid');
        if (!container) return;

        const allProjects = await DataLoader.loadAllProjects();
        const relatedPosts = generateRelatedPosts(currentProject, allProjects);

        if (relatedPosts.length === 0) {
            container.innerHTML = '<p class="text-secondary">No related posts available.</p>';
            return;
        }

        relatedPosts.forEach((project, index) => {
            const tile = TileRenderer.renderSectionTile(project);
            tile.style.animationDelay = `${index * 100}ms`;
            container.appendChild(tile);
        });
    }

    /**
     * Populate all content sections
     */
    function populateContent(project) {
        // Title + subtitle
        const titleEl = document.getElementById('entry-title');
        if (titleEl) titleEl.textContent = project.title;

        const subtitleEl = document.getElementById('entry-subtitle');
        if (subtitleEl) subtitleEl.textContent = project.subtitle;

        const roleEl = document.getElementById('entry-role');
        if (roleEl) roleEl.textContent = (project.role && project.role[0]) || '';

        // Body text
        const challengeEl = document.getElementById('entry-challenge');
        if (challengeEl) challengeEl.textContent = project.challenge;

        const approachEl = document.getElementById('entry-approach');
        if (approachEl) approachEl.textContent = project.approach;

        const resultEl = document.getElementById('entry-result');
        if (resultEl) resultEl.textContent = project.result;

        // Media components (in layout order)
        populateHero(project);
        populateThumbGrid(project);
        if (project.origin_url) populateProjectURL(project);
        if (project.repository) populateGitHubRepo(project.repository);
        populateGifs(project);
        populateImageGrid(project);
        populateSlideshows(project);
    }

    /**
     * Initialize entry page
     */
    async function init() {
        try {
            const entryPath = getEntryPath();
            const project = await loadEntryData(entryPath);

            if (!project) {
                console.error('Failed to load project data');
                document.body.innerHTML = '<div class="container"><h1>Entry not found</h1></div>';
                return;
            }

            populateMetadata(project);
            populateTagsCards(project);
            populateContent(project);
            initLightbox();
            await populateRelatedPosts(project);
        } catch (error) {
            console.error('Error initializing entry page:', error);
        }
    }

    return {
        init,
        loadEntryData,
        generateRelatedPosts
    };
})();

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', EntryController.init);
} else {
    EntryController.init();
}
