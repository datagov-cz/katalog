import { parseLabelResponse } from "./shared/couchdb-response.mjs";
import { SKOS } from "./shared/vocabulary.mjs";

export function createCouchDbLabel(couchDbConnector) {
  return {
    /**
     * Returns tuple [language, value].
     */
    "fetchLabel": (languages, iri) =>
      fetchLabel(couchDbConnector, languages, iri),
  };
}

async function fetchLabel(couchDbConnector, languages, iri) {
  const response = await couchDbConnector.fetch("labels", iri);
  return parseLabelResponse(languages, response, SKOS.prefLabel);
}
