
const DEFAULT_PAGE = 0;

export function parseClientQuery(navigation, query) {
  const distributionPage = navigation.queryArgumentFromClient(query, "distribution-page");

  return {
    "iri": navigation.queryArgumentFromClient(query, "iri"),
    "distributionPage": asPositiveNumber(distributionPage, DEFAULT_PAGE),
  };
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
  const result = { ...serverQuery };

  const pageSize = result["distributionPage"];
  delete result["distributionPage"];
  if (pageSize !== DEFAULT_PAGE) {
    result["distribution-page"] = pageSize;
  }

  return result;
}
