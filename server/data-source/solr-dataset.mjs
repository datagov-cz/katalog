import { prepareFieldQuery, prepareTextQuery, prepareSort } from "./shared/solr-query.mjs";
import { selectLanguage, parseFacet } from "./shared/solr-response.mjs";

const CORE = "dcat-ap-viewer";

export function createSolrDataset(solrConnector) {
  return {
    "fetchDatasets": (languages, query) =>
      fetchDatasets(solrConnector, languages, query),
    "fetchDatasetsForDatasetsDetail": (languages, query) =>
      fetchDatasetsForDatasetsDetail(solrConnector, languages, query),
  };
}

async function fetchDatasets(solrConnector, languages, query) {
  const solrQuery = buildDatasetsQuery(languages[0], query);
  const response = await solrConnector.fetch(CORE, solrQuery);
  return parseDatasetsResponse(languages, response);
}

function buildDatasetsQuery(language, query) {
  const {
    searchQuery,
    publisher,
    theme,
    keyword,
    format,
    dataServiceType,
    temporalStart,
    temporalEnd,
    vdfPublicData,
    vdfCodelist,
    isPartOf,
    sort,
    sortDirection,
    offset,
    limit
  } = query;
  const fq = [
    ...prepareFieldQuery("publisher", publisher),
    ...prepareFieldQuery("theme", theme),
    ...prepareFieldQuery("keyword", keyword),
    ...prepareFieldQuery("file_type", format),
    ...prepareFieldQuery("data_service_type", dataServiceType),
    ...prepareFieldQuery("is_part_of", isPartOf),
  ];
  if (temporalStart !== null) {
    fq.push(`temporal_start:[* TO ${temporalStart}T00:00:00Z]`);
  }
  if (temporalEnd !== null) {
    fq.push(`temporal_end:[${temporalEnd}T00:00:00Z TO *]`);
  }
  if (vdfCodelist === true) {
    fq.push("vdf_public_data:\"true\"");
  }
  if (vdfPublicData === true) {
    fq.push("vdf_codelist:\"true\"");
  }
  const result = {
    "facet.field": [
      `keyword_${language}`,
      "file_type",
      "data_service_type",
      "publisher",
      "theme",
    ],
    "fl": [
      "iri",
      "title_cs",
      "title_en",
      "description_cs",
      "description_en",
      "file_type",
    ],
    "fq": fq,
    "sort": prepareSort(language, sort, sortDirection),
    "facet": true,
    "facet.limit": -1,
    "facet.mincount": 1,
    "start": offset,
    "q": prepareTextQuery(language, searchQuery),
  };
  if (limit > 0) {
    result.rows = limit;
  }
  return result;
}

function parseDatasetsResponse(languages, response) {
  const language = languages[0];
  const documents = response["response"]["docs"].map(document => ({
    "iri": document["iri"],
    "title": selectLanguage(document, "title_", languages),
    "description": selectLanguage(document, "description_", languages),
    "file_type": document["file_type"] ?? [],
  }));

  const facet_fields = response["facet_counts"]["facet_fields"];
  const facets = {
    "keyword": parseFacet(facet_fields[`keyword_${language}`]),
    "format": parseFacet(facet_fields["file_type"]),
    "dataServiceType": parseFacet(facet_fields["data_service_type"]),
    "publisher": parseFacet(facet_fields["publisher"]),
    "theme": parseFacet(facet_fields["theme"]),
  };

  return {
    "found": response["response"]["numFound"],
    "documents": documents,
    "facets": facets,
  };
}

async function fetchDatasetsForDatasetsDetail(solrConnector, languages, query) {
  const solrQuery = buildDatasetsDetailQuery(languages[0], query);
  const response = await solrConnector.fetch(CORE, solrQuery);
  return parseDatasetsDetailResponse(languages, response);
}

function buildDatasetsDetailQuery(language, query) {
  const {
    isPartOf,
    sort,
    sortDirection,
  } = query;
  const fq = [
    ...prepareFieldQuery("is_part_of", isPartOf),
  ];
  const result = {
    "fl": [
      "iri",
      "title_cs",
      "title_en",
      "description_cs",
      "description_en",
      "file_type",
    ],
    "fq": fq,
    "sort": prepareSort(language, sort, sortDirection),
    "start": 0,
    "q": "*:*",
  };
  return result;
}

function parseDatasetsDetailResponse(languages, response) {
  const documents = response["response"]["docs"].map(document => ({
    "iri": document["iri"],
    "title": selectLanguage(document, "title_", languages),
    "description": selectLanguage(document, "description_", languages),
    "file_type": document["file_type"] ?? [],
  }));

  return {
    "found": response["response"]["numFound"],
    "documents": documents,
  };
}
