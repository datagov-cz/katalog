import configuration from "./configuration.mjs";

const SKOS_PREF_LABEL = "http://www.w3.org/2004/02/skos/core#prefLabel";

/**
 * Fetch labels for given IRI in given languages. Return Null when 
 * no labels can be found.
 */
export async function fetchLabel(languages, iri) {
  const response = await executeCouchDbQuery("labels", iri);
  if (response["error"] !== undefined) {
    // TODO Check for reason and missing label.
    return null;
  }
  const resource = response["jsonld"][0];
  const result = {};
  for (let item of (resource[SKOS_PREF_LABEL] ?? [])) {
    const language = item["@language"];
    if (languages.includes(language)) {
      result[language] = item["@value"];
    }
  }
  return result;
}

async function executeCouchDbQuery(dataset, id) {
  const url = configuration.couchDbUrl + "/" + dataset + "/" + encodeURIComponent(id);
  try {
    const response = await fetch(url);
    // TODO Check status code.
    return await response.json();
  } catch (error) {
    throw error;
  }
}
