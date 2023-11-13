import configuration from "./configuration.mjs";
import logger from "./logger.mjs";

/**
 * Fetch and return title for given dataset. Preferably return title in
 * given language. If there is no title returns given IRI.
 */
export async function fetchDatasetTitle(language, iri) {
  let payload;
  try {
    payload = await fetchDatasetDetail(iri);
  } catch (error) {
    logger.error("Failed to fetch dataset '%s': %o", iri, error);
    return iri;
  }
  // We can get empty object as a response.
  if (!Array.isArray(payload)) {
    return iri;
  }
  return loadDatasetTitle(language, iri, payload);
}

async function fetchDatasetDetail(iri) {
  const url = configuration.datasetCatalogLink + "/api/v2/dataset/item?iri=" + encodeURIComponent(iri);
  const response = await fetch(url);
  return await response.json();
}

function loadDatasetTitle(language, iri, resources) {
  let result = iri;
  for (let resource of resources) {
    if (resource["@id"] !== iri) {
      continue;
    }
    const titleValue = resource["http://purl.org/dc/terms/title"];
    for (let item of titleValue) {
      if (item["@language"] === language) {
        return item["@value"];
      } else {
        result = item["@value"];
      }
    }
  }
  return result;
}


