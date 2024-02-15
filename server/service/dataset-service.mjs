import configuration from "../configuration.mjs";

export function createDatasetService(couchDbDataset) {
  return {
    /**
     * Create and return link to dataset detail.
     * @param {string[]} language
     * @param {string} iri
     * @returns {string}
     */
    "datasetCatalogLink": (language, iri) =>
      datasetCatalogLink(language, iri),
    /**
     * Fetch and return preview data for datasets with given IRIs.
     * @param {string[]} languages
     * @param {string[]} iris
     * @returns {object[]}
     */
    "fetchDatasetPreviews": async (languages, iris) =>
      fetchDatasetPreviews(couchDbDataset, languages, iris),
  }
}

function datasetCatalogLink(language, iri) {
  let result = configuration.datasetCatalogLink;
  if (language === "cs") {
    result += "/datová-sada";
  } else {
    result += "/dataset";
  }
  result += "?iri=" + encodeURIComponent(iri);
  return result;
}

async function fetchDatasetPreviews(couchDbDataset, languages, iris) {
  const result = [];
  for (const iri of iris) {
    const dataset = await couchDbDataset.fetchDataset(languages, iri)
    result.push({
      "iri": iri,
      "title": dataset?.["title"] ?? iri,
      "description": dataset?.["description"] ?? "",
    });
  }
  return result;
}
