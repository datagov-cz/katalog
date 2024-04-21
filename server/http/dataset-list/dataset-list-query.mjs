import {DEFAULT_FACET_SIZE, DEFAULT_PAGE_SIZE} from "../../constants.mjs";

const SORT_OPTIONS = ["title"]

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
  const publisherLimit = navigation.queryArgumentFromClient(query, "publisher-limit");
  const themeLimit = navigation.queryArgumentFromClient(query, "theme-limit");
  const keywordLimit = navigation.queryArgumentFromClient(query, "keyword-limit");
  const formatLimit = navigation.queryArgumentFromClient(query, "format-limit");

  const vdfPublicData = navigation.queryArgumentFromClient(query, "vdf-public-data") === "1";
  const vdfCodelist = navigation.queryArgumentFromClient(query, "vdf-codelist") === "1";

  return {
    "searchQuery": navigation.queryArgumentFromClient(query, "query"),
    "publisher": navigation.queryArgumentArrayFromClient(query, "publisher"),
    "publisherLimit": asPositiveNumber(publisherLimit, DEFAULT_FACET_SIZE),
    "theme": navigation.queryArgumentArrayFromClient(query, "theme"),
    "themeLimit": asPositiveNumber(themeLimit, DEFAULT_FACET_SIZE),
    "keyword": navigation.queryArgumentArrayFromClient(query, "keyword"),
    "keywordLimit": asPositiveNumber(keywordLimit, DEFAULT_FACET_SIZE),
    "format": navigation.queryArgumentArrayFromClient(query, "format"),
    "formatLimit": asPositiveNumber(formatLimit, DEFAULT_FACET_SIZE),
    "dataServiceType": navigation.queryArgumentArrayFromClient(query, "data-service-type"),
    "dataServiceTypeLimit": -1, // We never limit this facet.
    "temporalStart": navigation.queryArgumentFromClient(query, "temporal-start"),
    "temporalEnd": navigation.queryArgumentFromClient(query, "temporal-end"),
    "vdfPublicData": vdfPublicData,
    "vdfCodelist": vdfCodelist,
    "isPartOf": navigation.queryArgumentArrayFromClient(query, "is-part-of"),
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
    return result;
  }
}

export function beforeLinkCallback(navigation, serverQuery) {
  const result = {};
  setIfNotEmpty(result, "query", serverQuery.searchQuery);
  setIfNotEmpty(result, "publisher", serverQuery.publisher);
  setIfNotDefault(result, "publisher-limit", serverQuery.publisherLimit, DEFAULT_FACET_SIZE);
  setIfNotEmpty(result, "theme", serverQuery.theme);
  setIfNotDefault(result, "theme-limit", serverQuery.themeLimit, DEFAULT_FACET_SIZE);
  setIfNotEmpty(result, "keyword", serverQuery.keyword);
  setIfNotDefault(result, "keyword-limit", serverQuery.keywordLimit, DEFAULT_FACET_SIZE);
  setIfNotEmpty(result, "format", serverQuery.format);
  setIfNotDefault(result, "format-limit", serverQuery.formatLimit, DEFAULT_FACET_SIZE);
  setIfNotEmpty(result, "data-service-type", serverQuery.dataServiceType);
  setIfNotEmpty(result, "temporal-start", serverQuery.temporalStart);
  setIfNotEmpty(result, "temporal-end", serverQuery.temporalEnd);
  setIfTrue(result, "vdf-public-data", serverQuery.vdfPublicData);
  setIfTrue(result, "vdf-codelist", serverQuery.vdfCodelist);
  setIfNotEmpty(result, "is-part-of", serverQuery.isPartOf);
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
