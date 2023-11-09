import configuration from "./configuration.mjs";
import * as solr from "./solr-query.mjs";

export async function fetchApplication(language, iri) {
  const query = {
    "fl": ["iri", "title_" + language, "description_" + language, "state", "platform", "theme", "type", "author"],
    "fq": [
      ...solr.prepareFieldQuery("iri", [iri]),
    ],
    "q": "*:*",
  };
  return await executeSolrQuery(query);  
}

async function executeSolrQuery(query) {
  let url = configuration.solrUrl + "/query?";
  url += Object.entries(query).map(([key, value]) => {
    if (Array.isArray(value)) {
      return value.map(item => key + "=" + encodeURIComponent(item)).join("&");
    } else {
      return key + "=" + encodeURIComponent(value);
    }
  }).join("&");
  try {
    const response = await fetch(url);
    // TODO Check status code.
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchApplications(language, searchQuery, state, platform, theme, type, author, dataset) {
  const query = {
    "facet.field": ["state", "platform", "theme", "type", "author", "dataset"],
    "fl": ["iri", "title_" + language, "description_" + language, "state", "platform", "theme", "type", "author"],
    "fq": [
      ...solr.prepareFieldQuery("state", state),
      ...solr.prepareFieldQuery("platform", platform),
      ...solr.prepareFieldQuery("theme", theme),
      ...solr.prepareFieldQuery("type", type),
      ...solr.prepareFieldQuery("author", author),
      ...solr.prepareFieldQuery("dataset", dataset),
    ],
    "facet": true,
    "facet.limit": -1,
    "facet.mincount": 1,
    "q": solr.prepareSolrTextQuery(language, searchQuery),
  };
  return await executeSolrQuery(query);  
}
