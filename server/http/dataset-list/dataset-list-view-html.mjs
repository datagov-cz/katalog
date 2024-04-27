import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

const FACET_SERIES = "datasetSeries";

const FACETS = ["publisher", "theme", "keyword", "format", "dataServiceType"];

const SORT_OPTIONS = [
  ["title", "asc"],
  ["title", "desc"],
];

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(
    services.translation, services.navigation, languages, query, data);
  const template = services.template.view(ROUTE.DATASET_LIST);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
}

export function prepareTemplateData(translation, navigation, languages, query, data) {
  const documents = data["documents"];
  prepareDocumentsInPlace(navigation, documents);
  const count = data["found"]["documents"];
  return {
    "navigation": components.createNavigationData(navigation, languages, query),
    "footer": components.createFooterData(),
    "search": {
      "value": query.searchQuery,
      "clear-href": navigation.linkFromServer({}),
      "search-href": navigation.linkFromServer({...query, "searchQuery": "_QUERY_", "page": 0}),
    },
    "result-bar": components.createResultBarData(translation, navigation, query, SORT_OPTIONS, count),
    "pagination": components.createPaginationData(navigation, query, count),
    "documents": documents,
    "facets": prepareFacets(translation, navigation, query, data["facets"], data["found"]),
  };
}

function prepareDocumentsInPlace(navigation, suggestions) {
  const suggestionDetailNavigation = navigation.changeView(ROUTE.DATASET_DETAIL);
  for (const suggestion of suggestions) {
    suggestion["href"] = suggestionDetailNavigation.linkFromServer({
      "iri": suggestion["iri"]
    });
  }
}

function prepareFacets(translation, navigation, query, facets, counts) {
  const result = [];
  if (query.isPartOf.length > 0) {
    const name = "isPartOf";
    const facetData = facets[name];
    const facetLabel = translation.translate(FACET_SERIES);
    //
    result.push(components.createFacetData(
      navigation, query, facetData, name, facetLabel, query.isPartOf.length));
  }
  for (const name of FACETS) {
    const facetData = facets[name];
    const facetLabel = translation.translate(name);
    result.push(components.createFacetData(
      navigation, query, facetData, name, facetLabel, counts[name]))
  }
  return result;
}
