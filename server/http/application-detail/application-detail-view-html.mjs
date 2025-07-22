import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

export function renderHtml(services, languages, query, data, reply) {
  if (data == null) {
    services.http.handleNotFound(services, reply);
    return;
  }
  const templateData = prepareTemplateData(services, languages, query, data);
  const template = services.template.view(ROUTE.APPLICATION_DETAIL);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
}

export function prepareTemplateData(services, languages, query, data) {
  const language = languages[0];
  const datasets = data["datasets"];
  prepareDatasetsInPlace(services.navigation, data["datasets"]);
  const application = prepareApplication(services.navigation, language, data);
  return {
    head: components.createHeadData(services.configuration),
    navigation: components.createNavigationData(
      services.navigation,
      languages,
      query,
    ),
    footer: components.createFooterData(),
    application: application,
    datasets: {
      visible: datasets.length > 0,
      items: datasets,
    },
  };
}

function prepareDatasetsInPlace(navigation, datasets) {
  const listNavigation = navigation.changeView(ROUTE.DATASET_DETAIL);
  for (const dataset of datasets) {
    dataset["href"] = listNavigation.linkFromServer({ iri: dataset["iri"] });
  }
}

function prepareApplication(navigation, language, application) {
  const authorTitle = application["author"]["title"];
  const authorIri = application["author"]["iri"];

  updateCodelistInPlace(navigation, application["states"], "state");
  updateCodelistInPlace(navigation, application["themes"], "theme");
  updateCodelistInPlace(navigation, application["platforms"], "platform");
  updateCodelistInPlace(navigation, application["types"], "type");

  return {
    author: {
      title: authorTitle,
      titleVisible: authorTitle !== null,
      iri: authorIri,
      iriVisible: authorIri !== null,
    },
    title: application["title"],
    description: application["description"],
    states: application["states"],
    themes: application["themes"],
    platforms: application["platforms"],
    types: application["types"],
    published: formatDate(language, application["published"]),
    modified: formatDate(language, application["modified"]),
    link: application["link"],
  };
}

function formatDate(language, value) {
  if (value === null) {
    return "-";
  }
  return value.toLocaleDateString(language);
}

function updateCodelistInPlace(navigation, items, name) {
  const listNavigation = navigation.changeView(ROUTE.APPLICATION_LIST);
  for (const item of items) {
    item["href"] = listNavigation.linkFromServer({ [name]: item["iri"] });
  }
}
