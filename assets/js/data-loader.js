/**
 * DATA LOADER (v5.0)
 * Fetches and caches JSON project data
 * Provides helper functions for filtering by role/skill/product/company tags
 */

const DataLoader = (() => {
  // Cache for loaded data
  const cache = {
    manifest: null,
    projects: new Map(),
    collections: new Map(),
    items: new Map(),
    itemUidIndex: null,
    homepageContent: null
  };

  /**
   * Normalize string for URL comparison
   * Converts "HTML/CSS/JS" -> "html-css-js"
   */
  function normalizeForURL(str) {
    return str
      .toLowerCase()
      .replace(/&/g, '')
      .replace(/\s+/g, '-')
      .replace(/\//g, '-')
      .replace(/-{2,}/g, '-')
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
      const response = await fetch(fullPath);
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

      const allProjectPaths = [...new Set(Object.values(manifest.entries))];
      const loadPromises = allProjectPaths.map(path => loadProject(path));
      const results = await Promise.all(loadPromises);

      results.forEach(project => {
        if (project) projects.push(project);
      });

    } catch (error) {
      console.error('Error in loadAllProjects:', error);
    }

    return projects;
  }

  /**
   * Load a single collection by its slug
   * Resolves the JSON path via manifest.collections[slug]; caches the Promise on slug.
   */
  async function loadCollection(slug) {
    if (cache.collections.has(slug)) {
      return cache.collections.get(slug);
    }

    const promise = (async () => {
      try {
        const manifest = await loadManifest();
        const jsonPath = manifest.collections && manifest.collections[slug];
        if (!jsonPath) {
          return null;
        }
        const response = await fetch('/' + jsonPath);
        if (!response.ok) {
          throw new Error(`Failed to load collection: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Error loading collection ${slug}:`, error);
        return null;
      }
    })();

    cache.collections.set(slug, promise);
    return promise;
  }

  /**
   * Load a single collection item by its slug
   * Resolves the JSON path via manifest.items[slug]; caches the Promise on slug.
   */
  async function loadCollectionItem(slug) {
    if (cache.items.has(slug)) {
      return cache.items.get(slug);
    }

    const promise = (async () => {
      try {
        const manifest = await loadManifest();
        const jsonPath = manifest.items && manifest.items[slug];
        if (!jsonPath) {
          return null;
        }
        const response = await fetch('/' + jsonPath);
        if (!response.ok) {
          throw new Error(`Failed to load item: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Error loading collection item ${slug}:`, error);
        return null;
      }
    })();

    cache.items.set(slug, promise);
    return promise;
  }

  /**
   * Build (once, lazily) a UID -> slug index for items.
   * collection.media[] references UIDs (e.g. "uid-itm-001") but the manifest is
   * keyed by slug. We walk every item JSON exactly one time, then cache the index.
   */
  async function getItemUidIndex() {
    if (cache.itemUidIndex) {
      return cache.itemUidIndex;
    }

    const index = new Map();
    try {
      const manifest = await loadManifest();
      const itemsMap = manifest.items || {};
      const slugs = Object.keys(itemsMap);

      const loadPromises = slugs.map(slug => loadCollectionItem(slug));
      const results = await Promise.all(loadPromises);

      results.forEach((item, i) => {
        if (item && item.id) {
          index.set(item.id, slugs[i]);
        }
      });
    } catch (error) {
      console.error('Error building item UID index:', error);
    }

    cache.itemUidIndex = index;
    return index;
  }

  /**
   * Resolve all items referenced in collection.media[].
   * collection.media[] is an array of item UIDs; this loads each item JSON
   * (in parallel) and returns the resolved item objects in the same order.
   * UIDs not present in the manifest are skipped silently.
   */
  async function resolveCollectionMedia(collection) {
    if (!collection || !Array.isArray(collection.media)) {
      return [];
    }

    try {
      const uidIndex = await getItemUidIndex();
      const loadPromises = collection.media.map(uid => {
        const slug = uidIndex.get(uid);
        if (!slug) return Promise.resolve(null);
        return loadCollectionItem(slug);
      });

      const results = await Promise.all(loadPromises);
      return results.filter(item => item);
    } catch (error) {
      console.error('Error resolving collection media:', error);
      return [];
    }
  }

  /**
   * Union of multiple collections' resolved items, deduped by item.id.
   * Order: items from the earliest slug come first; later duplicates are dropped.
   */
  async function unionCollections(slugs) {
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return [];
    }

    try {
      const collections = await Promise.all(slugs.map(slug => loadCollection(slug)));
      const mediaArrays = await Promise.all(
        collections.map(coll => (coll ? resolveCollectionMedia(coll) : Promise.resolve([])))
      );

      const seen = new Set();
      const union = [];
      mediaArrays.forEach(items => {
        items.forEach(item => {
          if (item && item.id && !seen.has(item.id)) {
            seen.add(item.id);
            union.push(item);
          }
        });
      });

      return union;
    } catch (error) {
      console.error('Error computing union of collections:', error);
      return [];
    }
  }

  /**
   * Intersection of multiple collections' resolved items.
   * Returns only items whose id appears in every collection's resolved media.
   * Result order follows the first collection's media order.
   */
  async function intersectCollections(slugs) {
    if (!Array.isArray(slugs) || slugs.length === 0) {
      return [];
    }

    try {
      const collections = await Promise.all(slugs.map(slug => loadCollection(slug)));
      const mediaArrays = await Promise.all(
        collections.map(coll => (coll ? resolveCollectionMedia(coll) : Promise.resolve([])))
      );

      if (mediaArrays.some(arr => arr.length === 0)) {
        return [];
      }

      const idSets = mediaArrays.map(items => new Set(items.map(it => it.id)));
      const [firstItems, ...restSets] = [mediaArrays[0], ...idSets.slice(1)];

      return firstItems.filter(item => {
        if (!item || !item.id) return false;
        return restSets.every(set => set.has(item.id));
      });
    } catch (error) {
      console.error('Error computing intersection of collections:', error);
      return [];
    }
  }

  /**
   * Get all tags from a project (role + skill + product + placement + company combined)
   */
  function getProjectTags(project) {
    return [
      ...(project.role || []),
      ...(project.skill || []),
      ...(project.product || []),
      ...(project.placement || []),
      ...(project.company ? [project.company] : [])
    ];
  }

  /**
   * Filter projects that have ANY of the given tags
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
   * Returns flat sorted array of all tags
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
   * Returns { role: [...], skill: [...], product: [...], company: [...] }
   */
  function getTagsByType(projects) {
    const roles = new Set();
    const skills = new Set();
    const products = new Set();
    const companies = new Set();

    projects.forEach(project => {
      (project.role || []).forEach(t => roles.add(t));
      (project.skill || []).forEach(t => skills.add(t));
      (project.product || []).forEach(t => products.add(t));
      if (project.company) companies.add(project.company);
    });

    return {
      role: Array.from(roles).sort(),
      skill: Array.from(skills).sort(),
      product: Array.from(products).sort(),
      company: Array.from(companies).sort()
    };
  }

  /**
   * Determine tag type for a given tag name across projects
   * Returns 'role', 'skill', 'product', or 'company'
   */
  function getTagType(projects, tagName) {
    const normalized = normalizeForURL(tagName);
    for (const project of projects) {
      if ((project.role || []).some(t => normalizeForURL(t) === normalized)) return 'role';
      if ((project.skill || []).some(t => normalizeForURL(t) === normalized)) return 'skill';
      if ((project.product || []).some(t => normalizeForURL(t) === normalized)) return 'product';
      if (project.company && normalizeForURL(project.company) === normalized) return 'company';
    }
    return 'skill'; // default
  }

  /**
   * Universal resolver for filter objects from homepage-content.json
   * Handles { all: [...], any: [...] } filter configurations
   */
  function resolveFilter(projects, filterObj) {
    if (!filterObj) return projects;

    const hasAll = filterObj.all && filterObj.all.length > 0;
    const hasAny = filterObj.any && filterObj.any.length > 0;

    if (!hasAll && !hasAny) return projects;

    let result = projects;

    if (hasAll) {
      result = filterByAllTags(result, filterObj.all);
    }

    if (hasAny) {
      result = filterByAnyTag(result, filterObj.any);
    }

    return result;
  }

  /**
   * Load and cache homepage content configuration
   */
  async function loadHomepageContent() {
    if (cache.homepageContent) return cache.homepageContent;
    try {
      const response = await fetch('/assets/js/homepage-content.json');
      if (!response.ok) throw new Error(`Failed to load homepage content: ${response.status}`);
      cache.homepageContent = await response.json();
      return cache.homepageContent;
    } catch (error) {
      console.error('Error loading homepage content:', error);
      return null;
    }
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
    loadCollection,
    loadCollectionItem,
    resolveCollectionMedia,
    unionCollections,
    intersectCollections,
    filterByAnyTag,
    filterByAllTags,
    getAllTags,
    getTagsByType,
    getTagType,
    getProjectTags,
    shuffleArray,
    normalizeForURL,
    resolveFilter,
    loadHomepageContent
  };
})();
