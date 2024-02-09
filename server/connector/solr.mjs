export function createSolrConnector(configuration, http) {
  const solrUrl = configuration.solrUrl;
  return {
    "fetch": (core, query) =>
      executeSolrQuery(solrUrl, http, core, query),
  };
}

async function executeSolrQuery(solrUrl, http, core, query) {
  const url = solrUrl + "/" + core + "/query?" + solrQueryToUrlQuery(query);
  try {
    const response = await http.fetch(url);
    return response.json();
  } catch (error) {
    throw error;
  }
}

function solrQueryToUrlQuery(query) {
  return Object.entries(query).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map(item => key + "=" + encodeURIComponent(item)).join("&");
    } else {
      return key + "=" + encodeURIComponent(value);
    }
  }).join("&");
}
