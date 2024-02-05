
export function registerFacet(templateService, language) {
  templateService.syncAddComponent("facet", "facet.html");
}

export function createFacetData(navigationService, query, facetData, facetName, facetLabel, count) {
  facetData.forEach(item => prepareFacetItemInPlace(navigationService, facetName, query, item))
  return {
    "label": facetLabel,
    "count": count,
    "items": facetData,
  }
}

function prepareFacetItemInPlace(navigationService, facetName, query, item) {
  const facetHref = [...query[facetName]];
  toggleItemInArray(facetHref, item["iri"])
  const nextQuery = {
    ...query,
    "page": 0,
    [facetName]: facetHref,
  }
  item["href"] = navigationService.linkFromServer(nextQuery);
}

function toggleItemInArray(items, value) {
  const index = items.indexOf(value);
  if (index === -1) {
    items.push(value);
  } else {
    items.splice(index, 1);
  }
}
