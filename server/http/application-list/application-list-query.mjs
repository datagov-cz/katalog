const SORT_OPTIONS = ["title", "modified"]

const SORT_DIRECTION_OPTIONS = ["asc", "desc"];

const DEFAULT_SORT = "title";

const DEFAULT_SORT_DIRECTION = "asc";

const DEFAULT_PAGE = 0;

const DEFAULT_PAGE_SIZE = 25;

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

  return {
    "query": navigation.queryArgumentFromClient(query, "query"),
    "state": navigation.queryArgumentArrayFromClient(query, "state"),
    "stateLimit": -1,
    "platform": navigation.queryArgumentArrayFromClient(query, "platform"),
    "platformLimit": -1,
    "theme": navigation.queryArgumentArrayFromClient(query, "theme"),
    "themeLimit": -1,
    "type": navigation.queryArgumentArrayFromClient(query, "type"),
    "typeLimit": -1,
    "author": navigation.queryArgumentArrayFromClient(query, "author"),
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

  delete result["stateLimit"];
  delete result["platformLimit"];
  delete result["themeLimit"];
  delete result["typeLimit"];

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
