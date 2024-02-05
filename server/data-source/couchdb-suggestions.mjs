import { getString } from "./shared/jsonld.mjs";
import { selectForLanguages } from "./shared/couchdb-response.mjs";
import { FOAF } from "./shared/vocabulary.mjs";

export function createCouchDbSuggestions(couchDbConnector) {
  return {
    "fetchLabel": (languages, iri) =>
      fetchLabel(couchDbConnector, languages, iri),
  };
}

async function fetchLabel(couchDbConnector, languages, iri) {
  const response = await couchDbConnector.fetch("suggestions", iri);
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
  const label = getString(resource, FOAF.name);
  return selectForLanguages(languages, label);
}
