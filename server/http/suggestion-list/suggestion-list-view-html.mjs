
import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

const FACETS = ["state", "theme", "publisher"];

const SORT_OPTIONS = [
  ["title", "asc"],
  ["title", "desc"],
  ["created", "asc"],
  ["created", "desc"],
];

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(
    services.translation, services.navigation, languages, query, data);
  const template = services.template.view(ROUTE.SUGGESTION_LIST);
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
    "navigation": components.createNavigationData(navigation, languages, query, { "suggestions": true }),
    "footer": components.createFooterData(),
    "search": components.createSearchData(navigation, translation, query),
    "result-bar": components.createResultBarData(translation, navigation, query, SORT_OPTIONS, applicationCount),
    "pagination": components.createPaginationData(navigation, query, applicationCount),
    "documents": documents,
    "facets": prepareFacets(translation, navigation, query, data["facets"], data["found"]),
  };
}

function prepareDocumentsInPlace(navigation, suggestions) {
  const applicationDetailNavigation = navigation.changeView(ROUTE.SUGGESTION_DETAIL);
  for (const application of suggestions) {
    application["href"] = applicationDetailNavigation.linkFromServer({
      "iri": application["iri"]
    });
  }
}

function prepareFacets(translation, navigation, query, facets, counts) {
  const result = [];
  for (const name of FACETS) {
    const facetData = facets[name];
    const facerLabel = translation.translate(name);
    result.push(components.createFacetData(
      navigation, query, facetData, name, facerLabel, counts[name]))
  }
  return result;
}
