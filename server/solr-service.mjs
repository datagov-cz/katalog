import configuration from "./configuration.mjs";
import * as solr from "./solr-query.mjs";

export async function fetchApplication(language, iri) {
  const query = {
    "fl": [
      "iri",
      "title_" + language, "description_" + language,
      "state", "platform", "theme", "type", "author", "link",
      "dataset", "modified", "published",
      "author_" + language
    ],
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

export async function fetchApplications(language, searchQuery, states, platforms, themes, types, authors, datasets, sort, sortDirection) {
  const query = {
    "facet.field": ["state", "platform", "theme", "type", "author", "dataset"],
    "fl": [
      "iri",
      "title_" + language, "description_" + language,
      "state", "platform", "theme", "type", "author",
    ],
    "fq": [
      ...solr.prepareFieldQuery("state", states),
      ...solr.prepareFieldQuery("platform", platforms),
      ...solr.prepareFieldQuery("theme", themes),
      ...solr.prepareFieldQuery("type", types),
      ...solr.prepareFieldQuery("author", authors),
      ...solr.prepareFieldQuery("dataset", datasets),
    ],
    "sort": prepareSort(language, sort, sortDirection),
    "facet": true,
    "facet.limit": -1,
    "facet.mincount": 1,
    "q": solr.prepareSolrTextQuery(language, searchQuery),
  };
  return await executeSolrQuery(query);
}

function prepareSort(language, sort, sortDirection) {
  if (sort === null) {
    return "";
  }
  if (sort === "title") {
    return "title_" + language + "_sort " + sortDirection;
  }
  return sort + " " + sortDirection;
}

export async function fetchApplicationsForDatasets(language, datasets) {
  const query = {
    "fl": ["iri", "title_" + language, "description_" + language],
    "fq": [
      solr.prepareFieldQuery("dataset", datasets).join(" OR "),
    ],
    "q": "*:*",
  };
  return await executeSolrQuery(query);
}
