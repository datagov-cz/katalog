import configuration from "../../configuration.mjs";
import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(
    services.navigation, languages, query, data);
  const template = services.template.view(ROUTE.APPLICATION_DETAIL);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
}

export function prepareTemplateData(navigation, languages, query, data) {
  const language = languages[0];
  const datasets = data["datasets"];
  prepareDatasetsInPlace(language, data["datasets"]);
  const application = prepareApplication(navigation, language, data);
  return {
    "navigation": components.createNavigationData(navigation, languages, query),
    "footer": components.createFooterData(),
    "application": application,
    "datasets": {
      "visible": datasets.length > 0,
      "items": datasets,
    },
  };
}

function prepareDatasetsInPlace(language, datasets) {
  for (const dataset of datasets) {
    dataset["href"] = datasetCatalogLink(language, dataset["iri"]);
  }
}

function datasetCatalogLink(language, iri) {
  let result = configuration.datasetCatalogLink;
  if (language === "cs") {
    result += "/datová-sada";
  } else {
    result += "/dataset";
  }
  result += "?iri=" + encodeURIComponent(iri);
  return result;
}

function prepareApplication(navigation, language, application) {
  const authorTitle = application["author"]["title"];
  const authorIri = application["author"]["iri"];

  updateCodelistInPlace(navigation, application["states"], "state");
  updateCodelistInPlace(navigation, application["themes"], "theme");
  updateCodelistInPlace(navigation, application["platforms"], "platform");
  updateCodelistInPlace(navigation, application["types"], "type");

  return {
    "author": {
      "title": authorTitle,
      "titleVisible": authorTitle !== null,
      "iri": authorIri,
      "iriVisible": authorIri !== null,
    },
    "title": application["title"],
    "description": application["description"],
    "states": application["states"],
    "themes": application["themes"],
    "platforms": application["platforms"],
    "types": application["types"],
    "published": formatDate(language, application["published"]),
    "modified": formatDate(language, application["modified"]),
    "link": application["link"],
  }
}

function formatDate(language, value) {
  const date = new Date(value);
  return date.toLocaleDateString(language);
}

function updateCodelistInPlace(navigation, items, name) {
  const listNavigation = navigation.changeView(ROUTE.APPLICATION_LIST);
  for (const item of items) {
    item["href"] = listNavigation.linkFromServer({ [name]: item["iri"] });
  }
}
