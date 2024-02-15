import { prepareFieldQuery, prepareTextQuery, prepareSort } from "./shared/solr-query.mjs";
import { emptyAsNull, parseFacet, parseDate } from "./shared/solr-response.mjs";

const CORE = "suggestions";

export function createSolrSuggestion(solrConnector) {
  return {
    "fetchSuggestion": (query) =>
      fetchSuggestion(solrConnector, query),
    "fetchSuggestions": (query) =>
      fetchSuggestions(solrConnector, query),
  };
}

async function fetchSuggestion(solrConnector, iri) {
  const solrQuery = buildSuggestionQuery(iri);
  const response = await solrConnector.fetch(CORE, solrQuery);
  return parseSuggestionResponse(response);
}

function buildSuggestionQuery(iri) {
  return {
    "fl": [
      "iri",
      "title_cs",
      "description_cs",
      "theme",
      "created",
      "publisher",
      "publisher_cs",
      "state",
      "dataset",
      "mandatory_106",
      "obstacle_special_regulation",
      "obstacle_106",
    ],
    "fq": [
      ...prepareFieldQuery("iri", [iri]),
    ],
    "q": "*:*",
  };
}

function parseSuggestionResponse( response) {
  const documentCount = response["response"]["numFound"];
  if (documentCount == 0) {
    return null;
  }
  const document = response["response"]["docs"][0];
  return {
    "iri": document["iri"],
    "title": document["title_cs"],
    "description": document["description_cs"],
    "created": parseDate(document["created"]),
    "themes": document["theme"] ?? [],
    "state": document["state"] ?? [],
    "datasets": document["dataset"] ?? [],
    "publisher": {
      "iri": emptyAsNull(document["publisher"]),
      "title": emptyAsNull(document["publisher_cs"]),
    },
    "mandatory_106": document["mandatory_106"],
    "obstacle_special_regulation": document["obstacle_special_regulation"],
    "obstacle_106": document["obstacle_106"],
  };
}

async function fetchSuggestions(solrConnector, query) {
  // We have only one language.
  const solrQuery = buildSuggestionsQuery(query);
  const response = await solrConnector.fetch(CORE, solrQuery);
  return parseSuggestionsResponse(response);
}

function buildSuggestionsQuery(query) {
  const {
    searchQuery,
    theme,
    publisher,
    state,
    sort,
    sortDirection,
    offset,
    limit
  } = query;
  return {
    "facet.field": [
      "theme",
      "publisher",
      "state",
    ],
    "fl": [
      "iri",
      "title_cs",
      "description_cs",
      "theme",
    ],
    "fq": [
      ...prepareFieldQuery("theme", theme),
      ...prepareFieldQuery("publisher", publisher),
      ...prepareFieldQuery("state", state),
    ],
    "sort": prepareSort("cs", sort, sortDirection),
    "facet": true,
    "facet.limit": -1,
    "facet.mincount": 1,
    "start": offset,
    "rows": limit,
    "q": prepareTextQuery("cs", searchQuery),
  };
}

function parseSuggestionsResponse(response) {
  const documents = response["response"]["docs"].map(document => ({
    "iri": document["iri"],
    "title": document["title_cs"],
    "description": document["description_cs"],
    "themes": document["theme"] ?? [],
  }));

  const facet_fields = response["facet_counts"]["facet_fields"];
  const facets = {
    "theme": parseFacet(facet_fields["theme"]),
    "publisher": parseFacet(facet_fields["publisher"]),
    "state": parseFacet(facet_fields["state"]),
  };

  return {
    "found": response["response"]["numFound"],
    "documents": documents,
    "facets": facets,
  };
}

