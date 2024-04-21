import {DEFAULT_FACET_SIZE} from "../constants.mjs";

export function registerFacet(templateService, language) {
  templateService.syncAddComponent("facet", "facet-" + language + ".html");
}

export function createFacetData(navigationService, query, facetData, facetName, facetLabel, count) {
  facetData.forEach(item => prepareFacetItemInPlace(navigationService, facetName, query, item))
  const result = {
    "label": facetLabel,
    "count": count,
    "items": facetData,
  };
  if (count > facetData.length) {
    result["showMoreHref"] = navigationService.linkFromServer({
      ...query,
      [facetName + "Limit"]: query[facetName + "Limit"] + DEFAULT_FACET_SIZE,
    });
    console.log(result["showMoreHref"], {facetName});
  }
  if (DEFAULT_FACET_SIZE < facetData.length) {
    result["showInitialHref"] = navigationService.linkFromServer({
      ...query,
      [facetName + "Limit"]: DEFAULT_FACET_SIZE,
    });
  }
  return result;
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
