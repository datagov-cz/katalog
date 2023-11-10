import configuration from "./configuration.mjs";
import * as solr from "./solr-query.mjs";

export async function fetchApplication(language, iri) {
  const query = {
    "fl": applicationFields(language),
    "fq": [
      ...solr.prepareFieldQuery("iri", [iri]),
    ],
    "q": "*:*",
  };
  return await executeSolrQuery(query);
}

function applicationFields(language) {
  return [
    "iri",
    "title_" + language, "description_" + language,
    "state", "platform", "theme", "type", "author"
  ];
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

export async function fetchApplications(language, searchQuery, states, platforms, themes, types, authors, datasets) {
  const query = {
    "facet.field": ["state", "platform", "theme", "type", "author", "dataset"],
    "fl": applicationFields(language),
    "fq": [
      ...solr.prepareFieldQuery("state", states),
      ...solr.prepareFieldQuery("platform", platforms),
      ...solr.prepareFieldQuery("theme", themes),
      ...solr.prepareFieldQuery("type", types),
      ...solr.prepareFieldQuery("author", authors),
      ...solr.prepareFieldQuery("dataset", datasets),
    ],
    "facet": true,
    "facet.limit": -1,
    "facet.mincount": 1,
    "q": solr.prepareSolrTextQuery(language, searchQuery),
  };
  return await executeSolrQuery(query);
}
