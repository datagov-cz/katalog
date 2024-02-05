export async function prepareData(services, languages, query) {
  const labelService = services.label;
  const data = await services.solrSuggestion.fetchSuggestion(query["iri"]);
  data["themes"] = await irisToResources(labelService, languages, data["themes"]);
  return data;
};

async function irisToResources(labelService, languages, iris) {
  const result = [];
  for (const iri of (iris ?? [])) {
    result.push(await iriToResource(labelService, languages, iri));
  }
  return result;
}

async function iriToResource(labelService, languages, iri) {
  const labels = await labelService.fetchLabel(languages, iri);
  return {
    "iri": iri,
    "label": labels ?? iri,
  }
}
