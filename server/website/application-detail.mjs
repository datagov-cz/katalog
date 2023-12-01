import { getTemplatesForLanguage } from "./templates-service.mjs";
import { getLocalization } from "../localization-service.mjs";
import { fetchApplicationWithLabels } from "../data-service.mjs";
import { clientTemplateData } from "../configuration.mjs";
import { createNavigationData } from "../navigation-service.mjs";

const VIEW_NAME = "application-detail";

const APPLICATION_LIST_VIEW_NAME = "application-list";

export default async function handleRequest(language, request, reply) {
  const templates = getTemplatesForLanguage(language);
  const localization = getLocalization(language).view(VIEW_NAME);
  const serverQuery = parseClientQuery(localization, request.query);
  const data = await fetchApplicationWithLabels(language, serverQuery["iri"]);
  if (data == null) {
    handleMissing(reply);
    return;
  }
  const templateData = prepareTemplateData(localization, serverQuery, data);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(templates[VIEW_NAME](templateData));
}

function parseClientQuery(localization, query) {
  return {
    "iri": localization.queryArgumentFromClient(query, "iri"),
  };
}

function handleMissing(reply) {
  reply
    .code(404)
    .send();
}

function prepareTemplateData(localization, query, data) {
  const listLocalization = localization.parent.view(APPLICATION_LIST_VIEW_NAME);
  return {
    ...data,
    "client": clientTemplateData(),
    "navigation": {
      ...createNavigationData(VIEW_NAME, query),
      "showApplicationLink": true,
    },
    //
    "state": addLinksToFilters(
      listLocalization, data["state"], "state"),
    "theme": addLinksToFilters(listLocalization,
      data["theme"], "theme"),
    "platform": addLinksToFilters(
      listLocalization, data["platform"], "platform"),
    "type": addLinksToFilters(
      listLocalization, data["type"], "type"),
    "published": formatDate(localization.language, data["published"]),
    "modified": formatDate(localization.language, data["modified"]),
    "showDataset": data["dataset"].length > 0,
    "showAuthorTitle": data["author"]["title"] !== null,
    "showAuthorIri": data["author"]["iri"] !== null,
  };
}

function addLinksToFilters(localization, items, name) {
  return items.map(item => ({
    "iri": item["iri"],
    "label": item["label"],
    "href": localization.linkFromServer({ [name]: item["iri"] })
  }));
}

function formatDate(language, value) {
  const date = new Date(value);
  return date.toLocaleDateString(language);
}
