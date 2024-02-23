import logger from "../logger.mjs";

const DEFAULT_IRI = resource => resource["iri"];

/**
 * Takes array of objects with fetchLabel functionality.
 */
export function createLabelService(sources, cacheSources) {
  const cache = new MemoryCache();
  const fetchLabel = (languages, iri) =>
    fetchLabelFromCouchDb(sources, cache, languages, iri);
  return {
    /**
     * Fetch and return label for resource.
     * @param {String[]} languages Language preferences.
     * @param {String} iri IRI.
     * @returns {String | Undefined}
     */
    "fetchLabel": fetchLabel,
    /**
     * Add label to given object.
     * @param {String[]} languages Language preferences.
     * @param {Object[]} resources Objects with iri.
     * @param {Function} defaultValue Select default label, where none is found.
     * @returns {}
     */
    "addLabelToResources": (languages, resources, defaultValue = DEFAULT_IRI) =>
      addLabelToResources(fetchLabel, languages, resources, defaultValue),
    /**
     * Asynchronous function re-load content of the cache.
     */
    "reloadCache": () => reloadCache(cache, cacheSources),
  };
}

/**
 * TODO Make sure cache is not growing too large.
 */
class MemoryCache {

  constructor() {
    this.cache = new Map();
  }

  get(language, iri) {
    const key = this.key(language, iri);
    return this.cache.get(key);
  }

  key(language, iri) {
    return language + ":" + iri;
  }

  update(language, iri, value) {
    const key = this.key(language, iri);
    this.cache.set(key, value);
  }

  size() {
    return this.cache.size;
  }

  /**
   * Swap inner cache structure of a memory cache.
   * @param {MemoryCache} other
   */
  swapContent(other) {
    const swap = this.cache;
    this.cache = other.cache;
    other.cache = swap;
  }

}

async function fetchLabelFromCouchDb(labelSources, cache, languages, iri) {
  const [cacheHit, cacheValue] = retrieveFromCache(cache, languages, iri);
  if (cacheHit) {
    return cacheValue;
  }
  // Fetch all data.
  let labels = {};
  for (const labelSource of labelSources) {
    const response = await labelSource.fetchLabel(languages, iri);
    if (response === null) {
      // Error.
      continue;
    }
    labels = { ...labels, ...response };
  }
  // Update cache and find our result.
  let result = null;
  for (const language of languages) {
    const cached = cache.get(language, iri);
    const label = labels[language] ?? null;
    if (cached == undefined) {
      cache.update(language, iri, label);
    }
    result = result ?? cached ?? label;
  }
  return result;
}

/**
 * Return tuple [cache hit; cached value] .
 */
function retrieveFromCache(cache, languages, iri) {
  for (const language of languages) {
    const cached = cache.get(language, iri);
    if (cached === undefined) {
      // There is undefined so we need to full load.
      return [false, undefined];
    } else if (cached === null) {
      // Stored in the cache as empty.
      continue;
    } else {
      // Cache hit.
      return [true, cached];
    }
  }
  // All values are cached and we still do not have the label.
  return [true, undefined];
}

async function reloadCache(cache, cacheSources) {
  // Initialize a new cache.
  const nextCache = new MemoryCache();
  const start = new Date();
  try {
    await initializeCacheFromSources(nextCache, cacheSources);
    // Swap cache content.
    cache.swapContent(nextCache);
  } catch (exception) {
    logger.error("Can't load label cache.", exception);
  }
  logger.info("Replacing old cache of size %d with new of size %d took %d ms",
    nextCache.size(), cache.size(), new Date() - start);
}

async function initializeCacheFromSources(cache, cacheSources) {
  for (const source of cacheSources) {
    const items = await source.fetchInitialCache(["cs", "en"]);
    for (const item of items) {
      for (const label of item.labels) {
        cache.update(label.language, item.iri, label.value);
      }
    }
  }
}

async function addLabelToResources(fetchLabel, languages, resources, defaultValue) {
  for (const resource of resources) {
    const label = await fetchLabel(languages, resource["iri"]);
    resource["label"] = label ?? defaultValue(resource);
  }
}
