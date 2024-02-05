import { getString } from "./shared/jsonld.mjs";
import { selectForLanguages } from "./shared/couchdb-response.mjs";
import { SKOS } from "./shared/vocabulary.mjs";

export function createCouchDbLabel(couchDbConnector) {
  return {
    "fetchLabel": (languages, iri) =>
      fetchLabel(couchDbConnector, languages, iri),
  };
}

async function fetchLabel(couchDbConnector, languages, iri) {
  const response = await couchDbConnector.fetch("labels", iri);
  if (response["error"] !== undefined) {
    // We assume it is missing.
    return null;
  }
  return parseLabelResponse(languages, response);
}

function parseLabelResponse(languages, response) {
  const jsonld = response["jsonld"];
  if (jsonld === undefined) {
    return null;
  }
  const resource = jsonld[0];
  if (resource === undefined) {
    return null;
  }
  const label = getString(resource, SKOS.prefLabel);
  return selectForLanguages(languages, label);
}
