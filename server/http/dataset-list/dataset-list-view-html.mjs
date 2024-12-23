import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

const FACET_SERIES = {
  "name": "datasetSeries",
  "tooltip": "datasetSeriesTooltip"
};

const FACETS = [
  { "name": "publisher", "tooltip": "publisherTooltip" },
  { "name": "theme", "tooltip": "themeTooltip" },
  { "name": "hvdCategory", "tooltip": "hvdCategoryTooltip" },
  { "name": "dataServiceType", "tooltip": "dataServiceTypeTooltip" },
  { "name": "format", "tooltip": "formatTooltip" },
  { "name": "keyword", "tooltip": "keywordTooltip" },
];

const SORT_OPTIONS = [
  ["title", "asc"],
  ["title", "desc"],
];

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(
    services.configuration, services.translation, services.navigation, languages, query, data);
  const template = services.template.view(ROUTE.DATASET_LIST);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
}

export function prepareTemplateData(configuration, translation, navigation, languages, query, data) {
  const documents = data["documents"];
  prepareDocumentsInPlace(navigation, documents);
  const count = data["found"]["documents"];
  return {
    "head": components.createHeadData(configuration),
    "navigation": components.createNavigationData(navigation, languages, query, { datasetsActive: true }),
    "footer": components.createFooterData(),
    "search": {
      "clear-href": navigation.linkFromServer({}),
      // Empty query used by client-side JavaScript search functionality.
      // We need to remove values for all in the search box as that is assembled
      // at the client side.
      "base-url": navigation.linkFromServer({
        ...query,
        "searchQuery": null,
        "page": 0,
        "temporalStart": null,
        "temporalEnd": null,
        "vdfPublicData": false,
        "vdfCodelist": false,
        "hvdDataset": false,
        "dynamicData": false,
      }),
      "query": {
        "searchQuery": query.searchQuery,
        "temporalFrom": query.temporalStart,
        "temporalTo": query.temporalEnd,
        "publicData": query.vdfPublicData,
        "codelist": query.vdfCodelist,
        "hvdDataset": query.hvdDataset,
        "dynamicData": query.dynamicData,
      },
      "queryObjectAsString": JSON.stringify({
        "searchQuery": query.searchQuery,
        "temporalFrom": query.temporalStart,
        "temporalTo": query.temporalEnd,
        "publicData": query.vdfPublicData,
        "codelist": query.vdfCodelist,
        "hvdDataset": query.hvdDataset,
        "dynamicData": query.dynamicData,
      })
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
    const facetLabel = translation.translate(FACET_SERIES.name);
    const facetTooltip = translation.translate(FACET_SERIES.tooltip);
    //
    result.push(components.createFacetData(
      navigation, query, facetData, name, facetLabel, facetTooltip,
      query.isPartOf.length));
  }
  for (const { name, tooltip } of FACETS) {
    const facetData = facets[name];
    const facetLabel = translation.translate(name);
    const facetTooltip = translation.translate(tooltip);
    result.push(components.createFacetData(
      navigation, query, facetData, name, facetLabel, facetTooltip,
      counts[name]));
  }
  return result;
}
