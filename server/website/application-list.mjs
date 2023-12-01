import { getTemplatesForLanguage } from "./templates-service.mjs";
import { getLocalization } from "../localization-service.mjs";
import { fetchApplicationsWithLabels } from "../data-service.mjs"
import { clientTemplateData } from "../configuration.mjs";
import { createNavigationData } from "../navigation-service.mjs";

const VIEW_NAME = "application-list";

const APPLICATION_DETAIL_VIEW_NAME = "application-detail";

const DEFAULT_SORT = "title";

const SORT_OPTIONS = ["title", "modified"];

const DEFAULT_SORT_DIRECTION = "asc";

const SORT_DIRECTION_OPTIONS = ["asc", "desc"];

const FACETS = ["theme", "type", "state", "platform"];

export default async function handleRequest(language, request, reply) {
  const templates = getTemplatesForLanguage(language);
  const localization = getLocalization(language).view(VIEW_NAME, beforeLinkCallback);
  const serverQuery = parseClientQuery(localization, request.query);
  const data = await fetchDataForTemplate(language, serverQuery);
  const templateData = prepareTemplateData(localization, serverQuery, data);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(templates[VIEW_NAME](templateData));
}

function beforeLinkCallback(localization, serverQuery) {
  const result = { ...serverQuery };

  const sort = result["sort"];
  if (sort === DEFAULT_SORT) {
    delete result["sort"];
  } else {
    result["sort"] = localization.argumentFromServer(sort);
  }

  const sortDirection = result["sort-direction"];
  if (sortDirection === DEFAULT_SORT_DIRECTION) {
    delete result["sort-direction"];
  } else {
    result["sort-direction"] = localization.argumentFromServer(sortDirection);
  }
  return result;
}

function parseClientQuery(localization, query) {
  const clientSort = localization.queryArgumentFromClient(query, "sort");
  const sort = selectArgumentFromClientQueryOrDefault(
    localization, SORT_OPTIONS, clientSort,
    DEFAULT_SORT);

  const clientSortDirection = localization.queryArgumentFromClient(
    query, "sort-direction");
  const sortDirection = selectArgumentFromClientQueryOrDefault(
    localization, SORT_DIRECTION_OPTIONS, clientSortDirection,
    DEFAULT_SORT_DIRECTION);

  return {
    "query": localization.queryArgumentFromClient(query, "query"),
    "state": localization.queryArgumentArrayFromClient(query, "state"),
    "platform": localization.queryArgumentArrayFromClient(query, "platform"),
    "theme": localization.queryArgumentArrayFromClient(query, "theme"),
    "type": localization.queryArgumentArrayFromClient(query, "type"),
    "author": localization.queryArgumentArrayFromClient(query, "author"),
    "sort": sort,
    "sort-direction": sortDirection,
  };
}

function selectArgumentFromClientQueryOrDefault(
  localization, options, clientValue, defaultValue) {
  for (const value of options) {
    const valueAsClient = localization.argumentFromServer(value);
    if (valueAsClient == clientValue) {
      return value;
    }
  }
  return defaultValue;
}

async function fetchDataForTemplate(language, query) {
  return await fetchApplicationsWithLabels(language, {
    "searchQuery": query["query"],
    "state": query["state"],
    "platform": query["platform"],
    "theme": query["theme"],
    "type": query["type"],
    "author": query["author"],
    "sort": query["sort"],
    "sortDirection": query["sort-direction"],
  });
}

function prepareTemplateData(localization, query, data) {
  const datasetFound = data["applications"]["count"];
  const applications = data["applications"]["items"];
  return {
    "client": clientTemplateData(),
    "navigation": {
      ...createNavigationData(VIEW_NAME, query),
      "showApplicationLink": false,
    },
    "message": {
      "found": localization.translateFromServer("datasets-found", datasetFound),
    },
    "search": {
      "value": query["query"],
      "name": localization.translateFromServer("query"),
    },
    "applications": {
      "items": addLinkToApplicationDetail(localization, applications),
    },
    "facets": updateFacetsForTemplate(localization, query, data["facets"]),
    "ordering": createOrderingForTemplate(localization, query),
  };
}



function addLinkToApplicationDetail(localization, applications) {
  const viewLocalization = localization.parent.view(APPLICATION_DETAIL_VIEW_NAME);
  return applications.map(application => ({
    ...application,
    "href": viewLocalization.linkFromServer({ "iri": application["iri"] }),
  }));
}

function updateFacetsForTemplate(localization, query, facets) {
  const result = [];
  for (const name of FACETS) {
    const items = facets[name]["items"];
    result.push({
      "label": localization.translateFromServer(name),
      "count": items.length,
      "items": createFacetItemsForTemplate(localization, query, items, name),
    });
  }
  return result;
}

function createFacetItemsForTemplate(localization, query, facetItems, name) {
  const selected = query[name];
  return facetItems.map(item => {
    const iri = item["iri"];
    let active = selected.includes(iri);
    const facetQuery = {
      ...query,
      [name]: active ? removeFromArray(selected, iri) : addToArray(selected, iri),
    };
    const href = localization.linkFromServer(facetQuery);
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

function createOrderingForTemplate(localization, query) {
  const activeSort = query["sort"];
  const activeDirection = query["sort-direction"];
  // 
  const options = [];
  for (const sort of SORT_OPTIONS) {
    for (const direction of SORT_DIRECTION_OPTIONS) {
      if (activeSort === sort && activeDirection === direction) {
        continue;
      }
      options.push({
        "label": translateOrderingPairFromServer(
          localization, sort, direction),
        "href": localization.linkFromServer(
          { ...query, sort, "sort-direction": direction }),
      });
    }
  }
  // 
  return {
    "active": translateOrderingPairFromServer(
      localization, activeSort, activeDirection),
    "items": options,
  };
}

function translateOrderingPairFromServer(localization, sort, direction) {
  return localization.translateFromServer(sort) + " "
    + localization.translateFromServer(direction);
}
