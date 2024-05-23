
import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

const FACETS = [
  { "name": "theme", "tooltip": "themeTooltip" },
  { "name": "type", "tooltip": "typeTooltip" },
  { "name": "state", "tooltip": "stateTooltip" },
  { "name": "theme", "tooltip": "platformTooltip" },
];

const SORT_OPTIONS = [
  ["title", "asc"],
  ["title", "desc"],
  ["modified", "asc"],
  ["modified", "desc"],
];

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(
    services.translation, services.navigation, languages, query, data);
  const template = services.template.view(ROUTE.APPLICATION_LIST);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
}

export function prepareTemplateData(translation, navigation, languages, query, data) {
  const documents = data["documents"];
  prepareDocumentsInPlace(navigation, documents);
  const applicationCount = data["found"]["documents"];
  return {
    "navigation": components.createNavigationData(navigation, languages, query, { applicationsActive: true }),
    "footer": components.createFooterData(),
    "search": {
      "value": query.searchQuery,
      "clear-href": navigation.linkFromServer({}),
      "search-href": navigation.linkFromServer({ ...query, "searchQuery": "_QUERY_", "page": 0 }),
    },
    "result-bar": components.createResultBarData(translation, navigation, query, SORT_OPTIONS, applicationCount),
    "pagination": components.createPaginationData(navigation, query, applicationCount),
    "documents": documents,
    "facets": prepareFacets(translation, navigation, query, data["facets"], data["found"]),
  };
}

function prepareDocumentsInPlace(navigation, applications) {
  const applicationDetailNavigation = navigation.changeView(ROUTE.APPLICATION_DETAIL);
  for (const application of applications) {
    application["href"] = applicationDetailNavigation.linkFromServer({
      "iri": application["iri"]
    });
  }
}

function prepareFacets(translation, navigation, query, facets, counts) {
  const result = [];
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
