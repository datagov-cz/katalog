import * as solr from "./solr-service.mjs";
import {fetchLabel} from "./label-service.mjs";

export async function fetchApplicationsWithLabels(language, searchQuery, state, platform, theme, type, author, dataset) {
  const solrData = await solr.fetchApplications(language, searchQuery, state, platform, theme, type, author, dataset);
  return {
    "applications": {
      "count": solrData["response"]["numFound"],
      "items": await updateApplications(language, solrData["response"]["docs"]),
    },
    "facets": await updateFacets(language, solrData["facet_counts"]["facet_fields"]),
  };
}

async function updateApplications(language, applications) {
  const result = [];
  for (let application of applications) {
    result.push({
      "iri": application["iri"],
      "title": application["title_" + language],
      "description": application["description_" + language],
      "state": await updateArrayOfCodelist(language, application["state"]),
      "platform": await updateArrayOfCodelist(language, application["platform"]),
      "theme": await updateArrayOfCodelist(language, application["theme"]),
      // TODO Check why type is a single value.
      "type": await updateArrayOfCodelist(language, [application["type"]]),
      "author": application["author"],
    });
  }
  return result;
}

async function updateArrayOfCodelist(language, iris) {
  const result = [];
  for (let iri of iris) {
    result.push({
      "label": await fetchLabel(language, iri),
      "iri": iri,
    });
  }
  return result;
}

async function updateFacets(language, facets) {
  const result = {};
  for (const [key, values] of Object.entries(facets)) {
    result[key] = {
      "items": await updateFacetValues(language, values),
    };
  }
  return result;
}

async function updateFacetValues(language, values) {
  const result = [];
  for (let index = 0; index < values.length; index += 2) {
    const iri = values[index];
    const count = values[index + 1];
    result.push({
      "iri": iri,
      "label": await fetchLabel(language, iri),
      "count": count,
    });
  }
  return result;
}

export async function fetchApplicationWithLabels(language, iri) {
  const solrData = await solr.fetchApplication(language, iri);
  const application = solrData["response"]["docs"][0];
  return {
    "iri": application["iri"],
    "title": application["title_" + language],
    "description": application["description_" + language],
    "state": await updateArrayOfCodelist(language, application["state"]),
    "platform": await updateArrayOfCodelist(language, application["platform"]),
    "theme": await updateArrayOfCodelist(language, application["theme"]),
    // TODO Check why type is a single value.
    "type": await updateArrayOfCodelist(language, [application["type"]]),
    "author": {
      "iri": application["author"],
      "title": application["author" + language],
    },    
  };
}
