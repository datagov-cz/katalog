
export async function prepareData(services, languages, query) {
  const data = await services.solrSuggestion.fetchSuggestions({
    "searchQuery": query.query,
    "theme": query.theme,
    "publisher": query.publisher,
    "sort": query.sort,
    "sortDirection": query.sortDirection,
    "offset": query.page * query.pageSize,
    "limit": query.pageSize,
  });

  const facets = data["facets"];

  data["found"] = {
    "documents": data["found"],
    "theme": facets["theme"].length,
    "publisher": facets["publisher"].length,
  };

  await updateApplicationsInPlace(services, languages, data["documents"]);

  await services.facet.updateFacetInPlace(
    languages, facets["theme"], query["theme"], query["themeLimit"]);
  await services.facet.updateFacetInPlace(
    languages, facets["publisher"], query["publisher"], query["publisherLimit"]);

  return data;
}

async function updateApplicationsInPlace(services, languages, documents) {
  for (const document of documents) {
    document["themes"] = document["themes"].map(iri => ({ "iri": iri }));
    await services.label.addLabelToResources(languages, document["themes"]);
  }
}
