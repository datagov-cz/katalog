import * as couchdb from "./couchdb-service.mjs";

/**
 * Holds map from IRIs to labels.
 */
const labelsCache = {};

/**
 * List of all languages.
 */
const LANGUAGES = ["cs", "en"];

/**
 * Fetch and return label for a given IRI. When no label is found,
 * return the given IRI.
 */
export async function fetchLabel(language, iri) {
  // TODO Employ method to cache for labels.
  let labels = labelsCache[iri];
  if (labelsCache[iri] === undefined) {
    labels = await couchdb.fetchLabel(LANGUAGES, iri);
    labelsCache[iri] = labels;
  }
  if (labels === undefined || labels === null) {
    return iri;
  }
  return labels[language];
}
