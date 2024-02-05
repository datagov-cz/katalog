const DEFAULT_IRI = resource => resource["iri"];

/**
 * Takes array of objects with fetchLabel functionality.
 */
export function createLabelService(sources) {
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
  };
}

class MemoryCache {

  constructor() {
    this.cache = new Map();
  }

  has(languages, iri) {
    const key = this.key(languages, iri);
    return this.cache.has(key);
  }

  key(languages, iri) {
    return languages.join(",") + iri;
  }

  get(languages, iri) {
    const key = this.key(languages, iri);
    return this.cache.get(key);
  }

  update(languages, iri, value) {
    // TODO Make sure cache is not growing too large.
    const key = this.key(languages, iri);
    this.cache.set(key, value);
  }
}

async function fetchLabelFromCouchDb(labelSources, cache, languages, iri) {
  if (cache.has(languages, iri)) {
    return cache.get(languages, iri);
  }
  let result = undefined;
  for (const labelSource of labelSources) {    
    result = await labelSource.fetchLabel(languages, iri);
    if (result !== null) {
      break;
    }
  }
  cache.update(languages, iri, result);
  return result;
}

async function addLabelToResources(fetchLabel, languages, resources, defaultValue) {
  for (const resource of resources) {
    const label = await fetchLabel(languages, resource["iri"]);
    resource["label"] = label ?? defaultValue(resource);
  }
}
