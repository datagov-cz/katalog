import {getTemplatesForLanguage} from "./templates-service.mjs";
import {getQueryArgument, createNavigationData} from "../localization-service.mjs";
import {fetchApplicationWithLabels} from "../data-service.mjs"

const VIEW_NAME = "application-detail";

export default async function handleRequest(language, request, reply) {
  const templates = getTemplatesForLanguage(language);
  const query = decodeUrlQuery(language, request);
  const data = await fetchApplicationWithLabels(language, query["iri"]);
  const templateData = prepareTemplateData(query, data);
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

function prepareTemplateData(query, data) {
  return {
    "navigation": createNavigationData(VIEW_NAME, query),
    ...data,
  };
}
