import * as querystring from "node:querystring";

import { fetchApplicationsWithLabels } from "../data-service.mjs"

const NO_DATASET_FILTER = [];

export default async function handleRequest(templates, request, reply) {
  const urlQuery = decodeUrlQuery(request);
  const payload = await fetchApplicationsWithLabels(
    "cs",
    urlQuery["query"], urlQuery["state"], urlQuery["platform"],
    urlQuery["theme"], urlQuery["type"], urlQuery["author"],
    NO_DATASET_FILTER);
  const templateData = {
    "search": {
      "value": urlQuery["query"],
      "name": "dotaz",
      "link": encodeUrlQuery("cs", { ...urlQuery, "query": undefined }),
    },
    "applications": {
      "count": payload["applications"]["count"],
      "items": updateApplicationsForHtml("cs", payload["applications"]["items"])
    },
    "facets": updateFacetsForHtml(
      (query) => encodeUrlQuery("cs", query), urlQuery, payload["facets"]),
  };
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8").send(templates["application-list"](templateData));
}

function decodeUrlQuery(request) {
  return {
    "query": request.query["dotaz"] ?? null,
    "state": asArray(request.query["stav"]),
    "platform": asArray(request.query["platforma"]),
    "theme": asArray(request.query["téma"]),
    "type": asArray(request.query["typ"]),
    "author": asArray(request.query["author"]),
  };
}

function asArray(value) {
  if (value === undefined || value === null) {
    return [];
  } else if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

function encodeUrlQuery(language, urlQuery) {
  let localizedUrlQuery;
  if (language === "cs") {
    localizedUrlQuery = {
      "dotaz": urlQuery["query"],
      "stav": urlQuery["state"],
      "platforma": urlQuery["platform"],
      "téma": urlQuery["theme"],
      "typ": urlQuery["type"],
      "author": urlQuery["author"],
    }
  }
  const nonEmpty = Object.fromEntries(Object.entries(localizedUrlQuery).filter(
    ([key, value]) => value !== undefined && value !== ""
  ));
  return "?" + querystring.stringify(nonEmpty);
}

function updateApplicationsForHtml(language, applications) {
  return applications.map(application => ({
    ...application,
    "href": "detail-aplikace?" + querystring.stringify({ "iri": application["iri"] }),
  }));
}

function updateFacetsForHtml(buildUrl, urlQuery, facets) {
  const theme = facets["theme"];
  const type = facets["type"];
  const state = facets["state"];
  const platform = facets["platform"];
  return [
    {
      "label": "Témata",
      "count": theme["items"].length,
      "items": updateWithSelected(buildUrl, "theme", urlQuery, theme["items"]),
    }, {
      "label": "Dostupnost",
      "count": type["items"].length,
      "items": updateWithSelected(buildUrl, "type", urlQuery, type["items"]),
    }, {
      "label": "Stav",
      "count": state["items"].length,
      "items": updateWithSelected(buildUrl, "state", urlQuery, state["items"]),
    }, {
      "label": "Platforma",
      "count": platform["items"].length,
      "items": updateWithSelected(buildUrl, "platform", urlQuery, platform["items"]),
    },
  ]
}

function updateWithSelected(buildUrl, name, urlQuery, values) {
  const selected = urlQuery[name];
  return values.map(item => {
    const active = selected.includes(item["iri"]);
    const href = buildUrl({
      ...urlQuery,
      [name]: active ? removeValue(urlQuery[name], item["iri"]) : addValue(urlQuery[name], item["iri"]),
    });
    return { active, href, ...item };
  });
}

function addValue(values, value) {
  if (values === undefined) {
    return [value];
  } else {
    return [...values, value];
  }
}

function removeValue(values, value) {
  const index = values.indexOf(value);
  if (index === -1) {
    return values;
  } else {
    return [...values.splice(1, index), ...values.splice(index + 1)];
  }
}
