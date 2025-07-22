const DEFAULT_PAGE = 1;

const DEFAULT_DISTRIBUTION_PAGE_SIZE = 25;

export function parseClientQuery(navigation, query) {
  const distributionPage = navigation.queryArgumentFromClient(
    query,
    "distribution-page",
  );

  return {
    iri: navigation.queryArgumentFromClient(query, "iri"),
    distributionPage: asPositiveNumber(distributionPage, DEFAULT_PAGE) - 1,
    distributionPageSize: DEFAULT_DISTRIBUTION_PAGE_SIZE,
  };
}

function asPositiveNumber(value, defaultValue) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  let result = parseInt(value, 10);
  if (isNaN(result)) {
    return defaultValue;
  } else {
    return result;
  }
}

export function beforeLinkCallback(navigation, serverQuery) {
  const result = {
    iri: serverQuery.iri,
  };

  if (serverQuery.distributionPage ?? DEFAULT_PAGE !== DEFAULT_PAGE) {
    // We use the input as we need get value in to the template.
    result["distribution-page"] = serverQuery.distributionPage;
  }

  return result;
}
