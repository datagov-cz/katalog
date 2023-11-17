import {getTemplatesForLanguage} from "./templates-service.mjs";
import {getQueryArgument, createNavigationData, createLink} from "../localization-service.mjs";
import {fetchApplicationWithLabels} from "../data-service.mjs"

const VIEW_NAME = "application-detail";

const APPLICATION_LIST_VIEW_NAME = "application-list";

export default async function handleRequest(language, request, reply) {
  const templates = getTemplatesForLanguage(language);
  const query = decodeUrlQuery(language, request);
  const data = await fetchApplicationWithLabels(language, query["iri"]);
  const templateData = prepareTemplateData(language, query, data);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(templates[VIEW_NAME](templateData));
}

function decodeUrlQuery(language, request) {
  return {
    "iri": getQueryArgument(VIEW_NAME, language, "iri", request.query, null),
  };
}

function prepareTemplateData(language, query, data) {
  return {
    ...data,
    "navigation": createNavigationData(VIEW_NAME, query),
    "state": addHrefToFilters(language, data["state"], "state"),
    "theme": addHrefToFilters(language, data["theme"], "theme"),
    "platform": addHrefToFilters(language, data["platform"], "platform"),
    "type": addHrefToFilters(language, data["type"], "type"),
  };
}

function addHrefToFilters(language, items, name) {
  return items.map(item => ({
    "iri": item["iri"],
    "label": item["label"],
    "href": createLink(APPLICATION_LIST_VIEW_NAME, language, { [name]: item["iri"] })
  }));
}
