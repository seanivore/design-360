/**
 * TILE RENDERER (v5.0)
 * Clean, simple tile structure - no absolute positioning
 */

const TileRenderer = (() => {

    /**
     * Render a section tile
     * @param {Object} project - Project data
     * @param {string[]} activeTags - Currently active filter tags (excluded from pill display)
     */
    function renderSectionTile(project, activeTags) {
        const slug = project.slug;
        // Entries link to their flat slug; collections carry an explicit _url
        // to their nested /<entry>/<coll> page.
        const entryURL = project._url || `/${slug}`;

        const thumbnails = project.thumb || [];
        const tileTexts = project.tiles || [];
        const displayText = tileTexts[0] || project.subtitle || project.title || 'View Project';
        const altText = project.thumb_alt || project.title || 'Project image';

        // Wrapper
        const tile = document.createElement('div');
        tile.className = 'tile fade-in-item';
        tile.setAttribute('data-entry-id', project.id);

        // Gallery (scroll container)
        const gallery = document.createElement('div');
        gallery.className = 'tile-gallery';

        thumbnails.forEach(img => {
            const imageLink = document.createElement('a');
            imageLink.href = entryURL;
            imageLink.style.display = 'block';
            imageLink.style.flexShrink = '0';

            const image = document.createElement('img');
            image.src = img.startsWith('http') ? img : `/${img}`;
            image.alt = altText;
            image.className = 'tile-image';
            image.loading = 'lazy';

            imageLink.appendChild(image);
            gallery.appendChild(imageLink);
        });

        // Text area
        const textArea = document.createElement('a');
        textArea.href = entryURL;
        textArea.className = 'tile-text-area';

        const text = document.createElement('p');
        text.className = 'tile-text';
        text.textContent = displayText;

        const title = document.createElement('h3');
        title.className = 'tile-title';
        title.textContent = project.title || '';

        textArea.appendChild(text);
        textArea.appendChild(title);
        tile.appendChild(gallery);
        tile.appendChild(textArea);

        // Tag pills (exclude active filter tags)
        const allTags = [
            ...(project.role || []),
            ...(project.skill || []),
            ...(project.product || [])
        ];
        const activeSet = new Set((activeTags || []).map(t => DataLoader.normalizeForURL(t)));
        let filteredTags = allTags.filter(t => !activeSet.has(DataLoader.normalizeForURL(t)));

        // Shuffle
        for (let i = filteredTags.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredTags[i], filteredTags[j]] = [filteredTags[j], filteredTags[i]];
        }

        if (filteredTags.length > 0) {
            const tagContainer = document.createElement('div');
            tagContainer.className = 'tile-tags';
            filteredTags.forEach(tag => {
                const pill = document.createElement('span');
                pill.className = 'tile-tag';
                pill.textContent = tag;
                tagContainer.appendChild(pill);
            });
            tile.appendChild(tagContainer);
        }

        // Text cycling
        if (tileTexts.length > 1) {
            let currentIndex = 0;
            setInterval(() => {
                currentIndex = (currentIndex + 1) % tileTexts.length;
                text.style.opacity = '0';
                setTimeout(() => {
                    text.textContent = tileTexts[currentIndex];
                    text.style.opacity = '1';
                }, 200);
            }, 4000);
        }

        return tile;
    }


    /**
     * Render homepage tile with dual rows
     */
    function renderHomepageTile(tileData) {
        const { section, sectionURL, thumbnailImagesTop, thumbnailImagesBottom, altText, projectCount } = tileData;

        // Wrapper
        const tile = document.createElement('div');
        tile.className = 'tile-homepage fade-in-item';
        tile.setAttribute('data-section', section);

        // Gallery (scroll container with two rows)
        const gallery = document.createElement('div');
        gallery.className = 'tile-homepage-gallery';

        // Top row
        const topRow = document.createElement('div');
        topRow.className = 'tile-homepage-gallery-row';
        thumbnailImagesTop.forEach(img => {
            const imageLink = document.createElement('a');
            imageLink.href = sectionURL;
            imageLink.style.display = 'block';
            imageLink.style.flexShrink = '0';

            const image = document.createElement('img');
            image.src = img.startsWith('http') ? img : `/${img}`;
            image.alt = altText;
            image.className = 'tile-homepage-image';
            image.loading = 'lazy';

            imageLink.appendChild(image);
            topRow.appendChild(imageLink);
        });

        // Bottom row
        const bottomRow = document.createElement('div');
        bottomRow.className = 'tile-homepage-gallery-row';
        thumbnailImagesBottom.forEach(img => {
            const imageLink = document.createElement('a');
            imageLink.href = sectionURL;
            imageLink.style.display = 'block';
            imageLink.style.flexShrink = '0';

            const image = document.createElement('img');
            image.src = img.startsWith('http') ? img : `/${img}`;
            image.alt = altText;
            image.className = 'tile-homepage-image';
            image.loading = 'lazy';

            imageLink.appendChild(image);
            bottomRow.appendChild(imageLink);
        });

        gallery.appendChild(topRow);
        gallery.appendChild(bottomRow);

        // Text area
        const textArea = document.createElement('a');
        textArea.href = sectionURL;
        textArea.className = 'tile-homepage-text';

        const header = document.createElement('div');
        header.className = 'tile-homepage-header';

        const sectionName = document.createElement('span');
        sectionName.className = 'tile-homepage-section';
        sectionName.textContent = `${section.toUpperCase()} PROJECTS`;

        const count = document.createElement('span');
        count.className = 'tile-homepage-count';
        count.textContent = `(${projectCount})`;

        header.appendChild(sectionName);
        header.appendChild(count);
        textArea.appendChild(header);

        tile.appendChild(gallery);
        tile.appendChild(textArea);

        return tile;
    }


    function showLoading(container) {
        if (!container) return;
        container.innerHTML = '';
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'flex';
    }

    function hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }

    function showEmptyState() {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) emptyState.style.display = 'block';
    }

    function hideEmptyState() {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) emptyState.style.display = 'none';
    }

    function renderSectionTiles(projects, container, activeTags) {
        showLoading(container);
        hideEmptyState();

        setTimeout(() => {
            container.innerHTML = '';

            if (projects.length === 0) {
                hideLoading();
                showEmptyState();
                return;
            }

            projects.forEach((project, index) => {
                try {
                    const tile = renderSectionTile(project, activeTags);
                    tile.style.animationDelay = `${index * 100}ms`;
                    container.appendChild(tile);
                } catch (error) {
                    console.error('Failed to render tile:', project?.id, error);
                }
            });

            hideLoading();
        }, 100);
    }

    return {
        renderSectionTile,
        renderHomepageTile,
        renderSectionTiles,
        showLoading,
        hideLoading,
        showEmptyState,
        hideEmptyState
    };
})();
