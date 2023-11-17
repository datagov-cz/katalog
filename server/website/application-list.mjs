import { getTemplatesForLanguage } from "./templates-service.mjs";
import { getQueryArgument, getQueryArgumentAsArray, createLink, createNavigationData, translate } from "../localization-service.mjs";

import { fetchApplicationsWithLabels } from "../data-service.mjs"

const NO_DATASET_FILTER = [];

const VIEW_NAME = "application-list";

const APPLICATION_DETAIL_VIEW_NAME = "application-detail";

export default async function handleRequest(language, request, reply) {
  const templates = getTemplatesForLanguage(language);
  const query = decodeUrlQuery(language, request);
  const data = await fetchDataForTemplate(language, query);
  const templateData = prepareTemplateData(language, query, data);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(templates[VIEW_NAME](templateData));
}

function decodeUrlQuery(language, request) {
  const query = request.query;
  return {
    "query": getQueryArgument(VIEW_NAME, language, "query", query, null),
    "state": getQueryArgumentAsArray(VIEW_NAME, language, "state", query),
    "platform": getQueryArgumentAsArray(VIEW_NAME, language, "platform", query),
    "theme": getQueryArgumentAsArray(VIEW_NAME, language, "theme", query),
    "type": getQueryArgumentAsArray(VIEW_NAME, language, "type", query),
    "author": getQueryArgumentAsArray(VIEW_NAME, language, "author", query),
  };
}

async function fetchDataForTemplate(language, query) {
  return await fetchApplicationsWithLabels(
    language,
    query["query"], query["state"], query["platform"],
    query["theme"], query["type"], query["author"], NO_DATASET_FILTER);
}

function prepareTemplateData(language, query, data) {
  return {
    "navigation": createNavigationData(VIEW_NAME, query),
    "message": {
      "found": translate(language, "datasets-found", [data["applications"]["count"]]),
    },
    "search": {
      "value": query["query"],
      "name": translate(language, "query"),
      "link": "",
    },
    "applications": {
      "items": updateApplicationsForHtml(language, data["applications"]["items"])
    },
    "facets": updateFacetsForHtml(language, query, data["facets"]),
  };
}

function updateApplicationsForHtml(language, applications) {
  return applications.map(application => ({
    ...application,
    "href": createLink(APPLICATION_DETAIL_VIEW_NAME, language, { "iri": application["iri"] }),
  }));
}

function updateFacetsForHtml(language, query, facets) {
  const theme = facets["theme"];
  const type = facets["type"];
  const state = facets["state"];
  const platform = facets["platform"]; 
  return [
    {
      "label": translate(language, "theme"),
      "count": theme["items"].length,
      "items": updateWithSelected(language, "theme", query, theme["items"]),
      }, {
        "label": translate(language, "type"),
        "count": type["items"].length,
        "items": updateWithSelected(language, "type", query, type["items"]),
      }, {
        "label": translate(language, "state"),
        "count": state["items"].length,
        "items": updateWithSelected(language, "state", query, state["items"]),
      }, {
        "label": translate(language, "platform"),
        "count": platform["items"].length,
        "items": updateWithSelected(language, "platform", query, platform["items"]),
    },
  ]
}

function updateWithSelected(language, name, query, facetItems) {
  const selected = query[name];
  return facetItems.map(item => {
    const iri = item["iri"];
    let active = selected.includes(iri);
    const facetQuery = {
      ...query,
      [name]: active ? removeFromArray(selected, iri) : addToArray(selected, iri),
    };
    const href = createLink(VIEW_NAME, language, facetQuery);
    return { active, href, ...item };
  });
}

function addToArray(array, value) {
  if (array === undefined) {
    return [value];
  } else {
    return [...array, value];
  }
}

function removeFromArray(array, value) {
  if (array === undefined) {
    return [];
  }
  const index = array.indexOf(value);
  if (index === -1) {
    return [...array];
  } else {
    return [...array.slice(0, index), ...array.slice(index + 1)];
  }
}
