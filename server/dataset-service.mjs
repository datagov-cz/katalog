import configuration from "./configuration.mjs";
/**
 * Fetch and return title for given dataset. Preferably return title in
 * given language. If there is no title returns given IRI.
 */
export async function fetchDatasetTitle(language, iri) {
  const url = configuration.datasetCatalogLink + "/api/v2/dataset/item?iri=" + encodeURIComponent(iri);
  const response = await fetch(url);
  const payload = await response.json();
  // We can get empty object as a response.
  if (!Array.isArray(payload)) {
    return iri;
  }
  let title = iri;
  for (let resource of payload) {    
    if (resource["@id"] !== iri) {
      continue;
    }
    const titleValue = resource["http://purl.org/dc/terms/title"];
    for (let item of titleValue) {
      if (item["@language"] === language) {
        return item["@value"];
      } else {
        title = item["@value"];
      }
    }
  }
  return title;
}



