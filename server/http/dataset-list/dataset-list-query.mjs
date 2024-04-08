const SORT_OPTIONS = ["title"]

const SORT_DIRECTION_OPTIONS = ["asc", "desc"];

const DEFAULT_SORT = "title";

const DEFAULT_SORT_DIRECTION = "asc";

const DEFAULT_PAGE = 0;

const DEFAULT_PAGE_SIZE = 25;

const DEFAULT_FACET_SIZE = 12;

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

export function beforeLinkCallback(navigation, serverQuery) {
  const result = { ...serverQuery };

  const sort = result["sort"];
  if (sort === DEFAULT_SORT) {
    delete result["sort"];
  } else {
    result["sort"] = navigation.argumentFromServer(sort);
  }

  const sortDirection = result["sortDirection"];
  delete result["sortDirection"];
  if (sortDirection !== DEFAULT_SORT_DIRECTION) {
    result["sort-direction"] = navigation.argumentFromServer(sortDirection);
  }

  if (result["page"] === DEFAULT_PAGE) {
    delete result["page"];
  }

  const pageSize = result["pageSize"];
  delete result["pageSize"];
  if (pageSize !== DEFAULT_PAGE_SIZE) {
    result["page-size"] = pageSize;
  }

  // TODO Remove facets!

  return result;
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
