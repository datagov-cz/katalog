import configuration from "./configuration.mjs";
import logger from "./logger.mjs";

const TITLE = "http://purl.org/dc/terms/title";

const DESCRIPTION = "http://purl.org/dc/terms/description";

/**
 * Fetch and return title for given dataset. Preferably return title in
 * given language. If there is no title returns given IRI.
 */
export async function fetchDatasetDetail(language, iri) {
  let payload;
  try {
    payload = await fetchDatasetDetailFromCatalog(iri);
  } catch (error) {
    logger.error("Failed to fetch dataset '%s': %o", iri, error);
    return iri;
  }
  // We can get empty object as a response.
  if (!Array.isArray(payload)) {
    return iri;
  }
  const dataset = selectDatasetResource(payload, iri);
  if (dataset === null) {
    return {
      "title": iri,
      "description": ""
    }
  }
  return {
    "title": loadLanguageString(dataset, language, TITLE) ?? iri,
    "description": loadLanguageString(dataset, language, DESCRIPTION) ?? "",
  }
}

async function fetchDatasetDetailFromCatalog(iri) {
  const url = configuration.datasetCatalogLink + "/api/v2/dataset/item?iri=" + encodeURIComponent(iri);
  const response = await fetch(url);
  return await response.json();
}

function selectDatasetResource(resources, iri) {
  for (let resource of resources) {
    if (resource["@id"] === iri) {
      return resource;
    }
  }
  return null;
}

function loadLanguageString(resource, language, iri) {
  let result = null;
  const value = resource[iri] ?? [];
  for (let item of value) {
    if (item["@language"] === language) {
      return item["@value"];
    } else {
      result = item["@value"];
    }
  }
  return result;
}

