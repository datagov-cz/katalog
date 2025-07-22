export function createDatasetService(couchDbDataset) {
  return {
    /**
     * Fetch and return preview data for datasets with given IRIs.
     * @param {string[]} languages
     * @param {string[]} iris
     * @returns {object[]}
     */
    fetchDatasetPreviews: async (languages, iris) =>
      fetchDatasetPreviews(couchDbDataset, languages, iris),
  };
}

async function fetchDatasetPreviews(couchDbDataset, languages, iris) {
  const result = [];
  for (const iri of iris) {
    const dataset = await couchDbDataset.fetchDatasetPreview(languages, iri);
    result.push({
      iri: iri,
      title: dataset?.title ?? iri,
      description: dataset?.description ?? "",
    });
  }
  return result;
}
