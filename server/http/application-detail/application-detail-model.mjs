export async function prepareData(services, languages, query) {
  const labelService = services.label;
  const data = await services.solrApplication.fetchApplication(languages, query["iri"]);
  data["states"] = await irisToResources(labelService, languages, data["states"]);
  data["platforms"] = await irisToResources(labelService, languages, data["platforms"]);
  data["themes"] = await irisToResources(labelService, languages, data["themes"]);
  data["types"] = await irisToResources(labelService, languages, data["types"])
  data["datasets"] = await prepareDatasets(services, languages, data["datasets"]);
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

async function prepareDatasets(services, languages, iris) {
  const result = [];
  for (const iri of iris) {
    const dataset = await services.couchDbDataset.fetchDataset(languages, iri)
    result.push({
      "iri": iri,
      "title": dataset?.["title"] ?? iri,
      "description": dataset?.["description"] ?? "",
    });
  }
  return result;
}
