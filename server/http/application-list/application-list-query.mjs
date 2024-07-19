import {DEFAULT_FACET_SIZE, DEFAULT_PAGE_SIZE} from "../../constants.mjs";

const SORT_OPTIONS = ["title", "modified"]

const SORT_DIRECTION_OPTIONS = ["asc", "desc"];

const DEFAULT_SORT = "title";

const DEFAULT_SORT_DIRECTION = "asc";

const DEFAULT_PAGE = 0;

export function parseClientQuery(navigation, query) {
  const clientSort = navigation.queryArgumentFromClient(query, "sort");
  const sort = selectArgumentFromClientQueryOrDefault(
    navigation, SORT_OPTIONS, clientSort,
    DEFAULT_SORT);

  const clientSortDirection = navigation.queryArgumentFromClient(
    query, "sort-direction");
  const sortDirection = selectArgumentFromClientQueryOrDefault(
    navigation, SORT_DIRECTION_OPTIONS, clientSortDirection,
    DEFAULT_SORT_DIRECTION);

  const page = navigation.queryArgumentFromClient(query, "page");
  const pageSize = navigation.queryArgumentFromClient(query, "page-size");
  const stateLimit = navigation.queryArgumentFromClient(query, "state-limit");
  const platformLimit = navigation.queryArgumentFromClient(query, "platform-limit");
  const themeLimit = navigation.queryArgumentFromClient(query, "theme-limit");
  const typeLimit = navigation.queryArgumentFromClient(query, "type-limit");

  return {
    "searchQuery": navigation.queryArgumentFromClient(query, "query"),
    "state": navigation.queryArgumentArrayFromClient(query, "state"),
    "stateLimit": asPositiveNumber(stateLimit, DEFAULT_FACET_SIZE),
    "platform": navigation.queryArgumentArrayFromClient(query, "platform"),
    "platformLimit": asPositiveNumber(platformLimit, DEFAULT_FACET_SIZE),
    "theme": navigation.queryArgumentArrayFromClient(query, "theme"),
    "themeLimit": asPositiveNumber(themeLimit, DEFAULT_FACET_SIZE),
    "type": navigation.queryArgumentArrayFromClient(query, "type"),
    "typeLimit": asPositiveNumber(typeLimit, DEFAULT_FACET_SIZE),
    "sort": sort,
    "sortDirection": sortDirection,
    "page": asPositiveNumber(page, 1) - 1,
    "pageSize": asPositiveNumber(pageSize, DEFAULT_PAGE_SIZE),
  };
}

function selectArgumentFromClientQueryOrDefault(
  navigation, options, clientValue, defaultValue
) {
  for (const value of options) {
    const valueAsClient = navigation.argumentFromServer(value);
    if (valueAsClient == clientValue) {
      return value;
    }
  }
  return defaultValue;
}

function asPositiveNumber(value, defaultValue) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  let result = parseInt(value,10);
  if (isNaN(result)) {
    return defaultValue;
  } else {
    return Math.max(1, result);
  }
}

export function beforeLinkCallback(navigation, serverQuery) {
  const result = {};
  setIfNotEmpty(result, "query", serverQuery.searchQuery);
  setIfNotEmpty(result, "state", serverQuery.state);
  setIfNotDefault(result, "state-limit", serverQuery.stateLimit, DEFAULT_FACET_SIZE);
  setIfNotEmpty(result, "platform", serverQuery.platform);
  setIfNotDefault(result, "platform-limit", serverQuery.platformLimit, DEFAULT_FACET_SIZE);
  setIfNotEmpty(result, "theme", serverQuery.theme);
  setIfNotDefault(result, "theme-limit", serverQuery.themeLimit, DEFAULT_FACET_SIZE);
  setIfNotEmpty(result, "type", serverQuery.type);
  setIfNotDefault(result, "type-limit", serverQuery.typeLimit, DEFAULT_FACET_SIZE);
  if (serverQuery.sort !== DEFAULT_SORT) {
    result["sort"] = navigation.argumentFromServer(serverQuery.sort);
  }
  if (serverQuery.sortDirection !== DEFAULT_SORT_DIRECTION) {
    result["sort-direction"] = navigation.argumentFromServer(serverQuery.sortDirection);
  }
  setIfNotDefault(result, "page", serverQuery.page, DEFAULT_PAGE);
  setIfNotDefault(result, "page-size", serverQuery.pageSize, DEFAULT_PAGE_SIZE);
  return result;
}

function setIfNotDefault(query, key, value, defaultValue) {
  if (value === undefined || value === null || value === defaultValue) {
    return;
  }
  query[key] = value;
}

function setIfNotEmpty(query, key, value) {
  if (value === undefined || value === null || value.length === 0) {
    return;
  }
  query[key] = value;
}

function setIfTrue(query, key, value) {
  if (value === true) {
    query[key] = value;
  }
}
