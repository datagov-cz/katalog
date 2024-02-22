import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(services, languages, query, data);
  const template = services.template.view(ROUTE.SUGGESTION_DETAIL);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
}

export function prepareTemplateData(services, languages, query, data) {
  const language = languages[0];
  const datasets = data["datasets"];
  prepareDatasetsInPlace(services, language, data["datasets"]);
  const suggestion = prepareSuggestion(services.navigation, language, data);
  return {
    "navigation": components.createNavigationData(
      services.navigation, languages, query, true),
    "footer": components.createFooterData(),
    "suggestion": suggestion,
    "datasets": {
      "visible": datasets.length > 0,
      "items": datasets,
    },
  };
}

function prepareDatasetsInPlace(services, language, datasets) {
  const datasetService = services.dataset;
  for (const dataset of datasets) {
    dataset["href"] = datasetService.datasetCatalogLink(
      language, dataset["iri"]);
  }
}

function prepareSuggestion(navigation, language, suggestion) {
  updateCodelistInPlace(navigation, suggestion["themes"], "theme");
  return {
    "iri": suggestion["iri"],
    "title": suggestion["title"],
    "description": suggestion["description"],
    "themes": suggestion["themes"],
    "state": suggestion["state"],
    "created": formatDate(language, suggestion["created"]),
    "mandatory_106": suggestion["mandatory_106"],
    "obstacle_special_regulation": suggestion["obstacle_special_regulation"],
    "obstacle_106": suggestion["obstacle_106"],
    "publisher": {
      "iri": suggestion["publisher"]["iri"],
      "title": suggestion["publisher"]["title"],
    },
    "publication_plan": suggestion["publication_plan"] ?? "",
  }
}

function formatDate(language, value) {
  if (value === null) {
    return "-";
  }
  return value.toLocaleDateString(language);
}

function updateCodelistInPlace(navigation, items, name) {
  const listNavigation = navigation.changeView(ROUTE.SUGGESTION_LIST);
  for (const item of items) {
    item["href"] = listNavigation.linkFromServer({ [name]: item["iri"] });
  }
}
