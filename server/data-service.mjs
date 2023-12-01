import * as solr from "./solr-service.mjs";
import { fetchLabel } from "./label-service.mjs";
import { fetchDatasetDetail } from "./dataset-service.mjs";
import configuration from "./configuration.mjs";

export async function fetchApplicationsWithLabels(language, query) {
  const solrData = await solr.fetchApplications(language, query);
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
  for (let iri of (iris ?? [])) {
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
  if (application == undefined) {
    return null;
  }
  return {
    "iri": application["iri"],
    "link": application["link"],
    "title": application["title_" + language],
    "description": application["description_" + language],
    "state": await updateArrayOfCodelist(language, application["state"]),
    "platform": await updateArrayOfCodelist(language, application["platform"]),
    "theme": await updateArrayOfCodelist(language, application["theme"]),
    "type": await updateArrayOfCodelist(language, [application["type"]]),
    "author": createAuthor(application, language),
    "dataset": await updateArrayOfDatasets(language, application["dataset"]),
    "published": application["published"],
    "modified": application["modified"],
  };
}

function createAuthor(application, language) {
  let iri = application["author"];
  if (isBlankOrEmpty(iri)) {
    iri = null;
  }
  let title = application["author_" + language];
  if (isBlankOrEmpty(title)) {
    title = null;
  }
  return {
    "iri": iri,
    "title": title,
  };
}

function isBlankOrEmpty(value) {
  return value === undefined || value === null || value.trim() === "";
}

async function updateArrayOfDatasets(language, iris) {
  const result = [];
  for (let iri of (iris ?? [])) {
    const detail = await fetchDatasetDetail(language, iri);
    result.push({
      "iri": iri,
      "title": detail["title"],
      "description": detail["description"],
      "href": datasetCatalogLink(language, iri),
    });
  }
  return result;
}

function datasetCatalogLink(language, dataset) {
  let result = configuration.datasetCatalogLink;
  if (language === "cs") {
    result += "/datová-sada";
  } else {
    result += "/dataset";
  }
  result += "?iri=" + encodeURIComponent(dataset);
  return result;
}

export async function fetchApplicationsWithDatasets(language, datasets) {
  if (datasets.length === 0) {
    return { "applications": [] };
  }
  const solrData = await solr.fetchApplicationsForDatasets(language, datasets);
  return {
    "applications": solrData["response"]["docs"].map(application => ({
      "iri": application["iri"],
      "title": application["title_" + language],
      "description": application["description_" + language],
    })),
  };
}

