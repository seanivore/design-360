/**
 * DATA LOADER
 * Fetches and caches JSON project data
 * Provides helper functions for filtering and searching
 */

const DataLoader = (() => {
    // Cache for loaded data
    const cache = {
        manifest: null,
        projects: new Map()
    };

    /**
     * Normalize string for URL comparison
     * Converts "HTML/CSS/JS" -> "html-css-js"
     */
    function normalizeForURL(str) {
        return str
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/\//g, '-')
            .trim();
    }

    /**
     * Load and cache the manifest file
     */
    async function loadManifest() {
        if (cache.manifest) {
            return cache.manifest;
        }

        try {
            const response = await fetch('/assets/js/manifest.json');
            if (!response.ok) {
                throw new Error(`Failed to load manifest: ${response.status}`);
            }
            cache.manifest = await response.json();
            return cache.manifest;
        } catch (error) {
            console.error('Error loading manifest:', error);
            // Return empty manifest structure if file doesn't exist yet
            return { entries: {}, sections: {} };
        }
    }

    /**
     * Load a single project by its JSON path
     */
    async function loadProject(jsonPath) {
        if (cache.projects.has(jsonPath)) {
            return cache.projects.get(jsonPath);
        }

        try {
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`Failed to load project: ${response.status}`);
            }
            const project = await response.json();
            cache.projects.set(jsonPath, project);
            return project;
        } catch (error) {
            console.error(`Error loading project from ${jsonPath}:`, error);
            return null;
        }
    }

    /**
     * Load all projects from a directory
     * Now using flat structure in /assets/entries/
     */
    async function loadAllProjects(section = null) {
        const projects = [];

        // All project files in flat structure
        const allProjectPaths = [
            '/assets/entries/uid-tev-176.json',
            '/assets/entries/uid-eme-689.json',
            '/assets/entries/uid-hwi-844.json',
            '/assets/entries/uid-lul-419.json',
            '/assets/entries/uid-qor-090.json',
            '/assets/entries/uid-rfr-187.json',
            '/assets/entries/uid-sgt-851.json',
            '/assets/entries/uid-srs-009.json',
            '/assets/entries/uid-wgw-370.json',
            '/assets/entries/uid-wnw-867.json',
            '/assets/entries/uid-dff-987.json',
            '/assets/entries/uid-fth-565.json',
            '/assets/entries/uid-unw-889.json',
            '/assets/entries/uid-wty-542.json'
        ];

        // Load all projects in parallel
        const loadPromises = allProjectPaths.map(path => loadProject(path));
        const results = await Promise.all(loadPromises);

        // Filter out any failed loads and apply section filter if provided
        results.forEach(project => {
            if (project) {
                // Apply section filter if specified
                if (!section || normalizeForURL(project.categorization.placement.section) === section) {
                    projects.push(project);
                }
            }
        });

        return projects;
    }

    /**
     * Filter projects by section
     */
    function filterBySection(projects, section) {
        const normalized = normalizeForURL(section);
        return projects.filter(p =>
            normalizeForURL(p.categorization.placement.section) === normalized
        );
    }

    /**
     * Filter projects by subsection
     */
    function filterBySubsection(projects, section, subsection) {
        const normalizedSection = normalizeForURL(section);
        const normalizedSubsection = normalizeForURL(subsection);

        return projects.filter(p => {
            const pSection = normalizeForURL(p.categorization.placement.section);
            const pSubsection = normalizeForURL(p.categorization.placement.sub_section);
            return pSection === normalizedSection && pSubsection === normalizedSubsection;
        });
    }

    /**
     * Filter projects by tags
     * Tags can come from any of the 4 tag categories
     */
    function filterByTags(projects, tags) {
        if (!tags || tags.length === 0) {
            return projects;
        }

        const normalizedTags = tags.map(t => normalizeForURL(t));

        return projects.filter(project => {
            const tagging = project.categorization.tagging;
            const allTags = [
                ...tagging.technology,
                ...tagging.media,
                ...tagging.role,
                ...tagging.skill
            ].map(t => normalizeForURL(t));

            // Project must have ALL selected tags
            return normalizedTags.every(tag => allTags.includes(tag));
        });
    }

    /**
     * Get all unique tags from a list of projects
     * Returns object with tags categorized
     */
    function getAllTags(projects) {
        const tagSet = new Set();

        projects.forEach(project => {
            const tagging = project.categorization.tagging;
            [
                ...tagging.technology,
                ...tagging.media,
                ...tagging.role,
                ...tagging.skill
            ].forEach(tag => tagSet.add(tag));
        });

        return Array.from(tagSet).sort();
    }

    /**
     * Shuffle array (Fisher-Yates algorithm)
     * Used for random tile ordering
     */
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Public API
    return {
        loadManifest,
        loadProject,
        loadAllProjects,
        filterBySection,
        filterBySubsection,
        filterByTags,
        getAllTags,
        shuffleArray,
        normalizeForURL
    };
})();
