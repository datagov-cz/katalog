import { getString } from "./shared/jsonld.mjs";
import { selectForLanguages } from "./shared/couchdb-response.mjs";
import { DCTERMS } from "./shared/vocabulary.mjs";

export function createCouchDbDataset(couchDbConnector) {
  return {
    "fetchDataset": (languages, iri) =>
      fetchDataset(couchDbConnector, languages, iri),
  };
}

async function fetchDataset(couchDbConnector, languages, iri) {
  const response = await couchDbConnector.fetch("datasets", iri);
  if (response["error"] !== undefined) {
    // We assume it is missing.
    return null;
  }
  const dataset = jsonldToDataset(response["jsonld"], iri);
  return {
    ...dataset,
    "title": selectForLanguages(languages, dataset["title"]),
    "description": selectForLanguages(languages, dataset["description"]),
  };
}

function jsonldToDataset(jsonld, iri) {
  const datasetResource = selectResourceByIri(jsonld, iri);
  if (datasetResource === null) {
    // Dataset not found.
    return null;
  }
  const result = createEmptyDataset(iri);
  loadDatasetMandatory(datasetResource, result);
  // https://github.com/linkedpipes/dcat-ap-viewer/blob/develop/client/api-nkod/jsonld-to-dataset.ts
  return result;
}

function selectResourceByIri(jsonld, iri) {
  for (const resource of jsonld) {
    if (resource["@id"] == iri) {
      return resource;
    }
  }
  return null;
}

function createEmptyDataset(iri) {
  return {
    "iri": iri,
    "title": null,
    "description": null,
    "contactPoints": [],
    "distributions": [],
    "keywords": [],
    "publisher": null,
    "themes": [],
    "datasetThemes": [],
    "accessRights": [],
    "conformsTo": [],
    "documentation": [],
    "frequency": null,
    "hasVersion": [],
    "identifier": [],
    "isVersionOf": [],
    "landingPage": [],
    "language": [],
    "otherIdentifier": [],
    "provenance": [],
    "relation": [],
    "issued": [],
    "sample": [],
    "source": [],
    "spatial": [],
    "spatialResolutionInMeters": null,
    "temporal": null,
    "temporalResolution": null,
    "type": [],
    "modified": [],
    "version": [],
    "versionNotes": [],
    "datasets": [],
    "parentDataset": null,
    "catalog": null,
    "catalogSource": null,
    "lkod": null,
    "isFromForm": false,
    "isFromCatalog": false,
    "semanticThemes": [],
    "isFromVdf": false,
    "isCodelist": false,
    "vdfOriginator": null,
  }
}

function loadDatasetMandatory(entity, collector) {
  collector.title = getString(entity, DCTERMS.title);
  collector.description = getString(entity, DCTERMS.description);
}
