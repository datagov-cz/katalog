
export async function prepareData(services, languages, query) {
  const data = await services.solrDataset.fetchDatasets(languages, {
    "searchQuery": query.searchQuery,
    "publisher": query.publisher,
    "theme": query.theme,
    "keyword": query.keyword,
    "format": query.format,
    "dataServiceType": query.dataServiceType,
    "temporalStart": query.temporalStart,
    "temporalEnd": query.temporalEnd,
    "vdfPublicData": query.vdfPublicData,
    "vdfCodelist": query.vdfCodelist,
    "isPartOf": query.isPartOf,
    "sort": query.sort,
    "sortDirection": query.sortDirection,
    "offset": query.page * query.pageSize,
    "limit": query.pageSize,
  });

  const facets = data["facets"];

  data["found"] = {
    "documents": data["found"],
    "keyword": facets["keyword"].length,
    "format": facets["format"].length,
    "dataServiceType": facets["dataServiceType"].length,
    "publisher": facets["publisher"].length,
    "theme": facets["theme"].length,
  };

  await updateDatasetsInPlace(services, languages, data["documents"]);

  // We create dataset series facet. As we use it as a filter,
  // it is not part of Solr response.
  facets.isPartOf = [];
  for (const iri of query.isPartOf) {
    facets.isPartOf.push({
      "iri": iri,
      "count": data["found"]["documents"],
      "active": true,
      "label": (await services.couchDbDataset.fetchDatasetPreview(languages, iri))?.title ?? iri,
    });
  }

  // Other facets.
  await services.facet.updateFacetInPlace(
    languages, facets["keyword"], query["keyword"], query["keywordLimit"],
    (item) => item.label = item.iri);
  await services.facet.updateFacetInPlace(
    languages, facets["format"], query["format"], query["formatLimit"]);
  await services.facet.updateFacetInPlace(
    languages, facets["dataServiceType"], query["dataServiceType"], query["dataServiceTypeLimit"]);
  await services.facet.updateFacetInPlace(
    languages, facets["publisher"], query["publisher"], query["publisherLimit"]);
  await services.facet.updateFacetInPlace(
    languages, facets["theme"], query["theme"], query["themeLimit"]);

  return data;
};

async function updateDatasetsInPlace(services, languages, documents) {
  for (const document of documents) {
    document["format"] = document["file_type"].map(iri => ({ "iri": iri }));
    delete document["file_type"];
    await services.label.addLabelToResources(languages, document["format"]);
  }
}

