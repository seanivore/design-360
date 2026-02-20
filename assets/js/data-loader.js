/**
 * DATA LOADER (v4.0)
 * Fetches and caches JSON project data
 * Provides helper functions for filtering by role/skill tags
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
      return { entries: {} };
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
      const fullPath = '/' + jsonPath;
      console.log(`🔍 Fetching: ${fullPath}`);
      const response = await fetch(fullPath);
      if (!response.ok) {
        console.error(`❌ Failed to fetch ${fullPath}: ${response.status}`);
        throw new Error(`Failed to load project: ${response.status}`);
      }
      const project = await response.json();
      console.log(`✅ Loaded: ${jsonPath}`);
      cache.projects.set(jsonPath, project);
      return project;
    } catch (error) {
      console.error(`❌ Error loading project from ${jsonPath}:`, error);
      return null;
    }
  }

  /**
   * Load all projects dynamically from manifest
   */
  async function loadAllProjects() {
    const projects = [];

    try {
      const manifest = await loadManifest();

      if (!manifest.entries || Object.keys(manifest.entries).length === 0) {
        console.warn('No entries found in manifest');
        return projects;
      }

      // Get unique JSON file paths from manifest
      const allProjectPaths = [...new Set(Object.values(manifest.entries))];

      console.log(`📂 Loading ${allProjectPaths.length} projects from manifest`);

      // Load all projects in parallel
      const loadPromises = allProjectPaths.map(path => loadProject(path));
      const results = await Promise.all(loadPromises);

      let successCount = 0;
      results.forEach(project => {
        if (project) {
          successCount++;
          projects.push(project);
        }
      });

      console.log(`✅ Successfully loaded ${successCount}/${allProjectPaths.length} projects`);

    } catch (error) {
      console.error('Error in loadAllProjects:', error);
    }

    return projects;
  }

  /**
   * Get all tags from a project (both role and skill combined)
   */
  function getProjectTags(project) {
    const tags = project.categorization?.tags || {};
    return [
      ...(tags.role || []),
      ...(tags.skill || [])
    ];
  }

  /**
   * Filter projects that have ANY of the given tags
   * Matches against both role and skill arrays
   */
  function filterByAnyTag(projects, tagNames) {
    if (!tagNames || tagNames.length === 0) {
      return projects;
    }

    const normalizedSearch = tagNames.map(t => normalizeForURL(t));

    return projects.filter(project => {
      const allTags = getProjectTags(project).map(t => normalizeForURL(t));
      return normalizedSearch.some(tag => allTags.includes(tag));
    });
  }

  /**
   * Filter projects that have ALL of the given tags
   * Matches against both role and skill arrays
   */
  function filterByAllTags(projects, tagNames) {
    if (!tagNames || tagNames.length === 0) {
      return projects;
    }

    const normalizedSearch = tagNames.map(t => normalizeForURL(t));

    return projects.filter(project => {
      const allTags = getProjectTags(project).map(t => normalizeForURL(t));
      return normalizedSearch.every(tag => allTags.includes(tag));
    });
  }

  /**
   * Get all unique tags from a list of projects
   * Returns flat sorted array of all tags (role + skill combined)
   */
  function getAllTags(projects) {
    const tagSet = new Set();

    projects.forEach(project => {
      getProjectTags(project).forEach(tag => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }

  /**
   * Get tags grouped by type from a list of projects
   * Returns { role: [...], skill: [...] }
   */
  function getTagsByType(projects) {
    const roles = new Set();
    const skills = new Set();

    projects.forEach(project => {
      const tags = project.categorization?.tags || {};
      (tags.role || []).forEach(t => roles.add(t));
      (tags.skill || []).forEach(t => skills.add(t));
    });

    return {
      role: Array.from(roles).sort(),
      skill: Array.from(skills).sort()
    };
  }

  /**
   * Determine tag type for a given tag name across projects
   * Returns 'role' or 'skill'
   */
  function getTagType(projects, tagName) {
    const normalized = normalizeForURL(tagName);
    for (const project of projects) {
      const tags = project.categorization?.tags || {};
      if ((tags.role || []).some(t => normalizeForURL(t) === normalized)) return 'role';
      if ((tags.skill || []).some(t => normalizeForURL(t) === normalized)) return 'skill';
    }
    return 'skill'; // default
  }

  /**
   * Shuffle array (Fisher-Yates algorithm)
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
    filterByAnyTag,
    filterByAllTags,
    getAllTags,
    getTagsByType,
    getTagType,
    getProjectTags,
    shuffleArray,
    normalizeForURL
  };
})();
