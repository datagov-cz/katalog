import logger from "../logger.mjs";

import {ConnectorError} from "./connector-error.mjs";

const STATUS_CODE_INVALID_QUERY = 400;

export function createSolrConnector(solrUrl, http) {
  return {
    "fetch": (core, query) =>
      executeSolrQuery(solrUrl, http, core, query),
  };
}

async function executeSolrQuery(solrUrl, http, core, query) {
  const url = solrUrl + "/" + core + "/query?" + solrQueryToUrlQuery(query);
  try {
    const response = await http.fetch(url);
    if (response.status === STATUS_CODE_INVALID_QUERY) {
      logger.info({ query, url }, "Invalid Solr query.");
      throw new ConnectorError("Solr");
    }
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
