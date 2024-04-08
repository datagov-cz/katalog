import assert from "node:assert";
import { describe, it } from "node:test"

import { createCouchDbCatalog } from "./couchdb-catalog.mjs";

describe("Load catalog from JSONLD.", async () => {

  it("DcatApSparql", async () => {
    const solrResponse = [{
      "@id": "https://data.gov.cz/zdroj/lokální-katalogy/9999996",
      "@type": "https://data.gov.cz/slovník/nkod/DcatApSparql",
      "http://purl.org/dc/terms/publisher": {
        "@id": "https://data.gov.cz/zdroj/ovm/000000"
      },
      "http://purl.org/dc/terms/title": [{
        "@language": "en",
        "@value": "Dev catalog"
      }, {
        "@language": "cs",
        "@value": "Vývojový katalog"
      }],
      "http://www.w3.org/ns/dcat#contactPoint": {
        "http://xmlns.com/foaf/0.1/email": "user@example.cz",
        "http://xmlns.com/foaf/0.1/name": "Martin"
      },
      "http://www.w3.org/ns/dcat#endpointURL": {
        "@id": "https://opendata.mfcr.cz/lod/sparql"
      },
      "http://xmlns.com/foaf/0.1/homepage": {
        "@id": "https://example.com/homepage"
      }
    }];
    const catalogs = createCouchDbCatalog({"fetch": () => solrResponse,});
    const actual = await catalogs.fetchCatalogs(["cs"]);
    const expected = [{
      "iri": "https://data.gov.cz/zdroj/lokální-katalogy/9999996",
      "type": "DcatApSparql",
      "publisher": {
        "iri": "https://data.gov.cz/zdroj/ovm/000000",
      },
      "title": "Vývojový katalog",
      "contactPoint": {
        "email": "user@example.cz",
        "name": "Martin",
      },
      "endpointURL": "https://opendata.mfcr.cz/lod/sparql",
      "homepage": "https://example.com/homepage",
    }];
    assert.deepEqual(actual, expected);
  });

  it("CkanApiLkod", async () => {
    const solrResponse = [{
      "@id": "https://data.gov.cz/zdroj/lokální-katalogy/6946049",
      "@type": "https://data.gov.cz/slovník/nkod/CkanApiLkod",
      "http://purl.org/dc/terms/publisher": {
        "@id": "https://data.gov.cz/zdroj/ovm/Poskytovatel1"
      },
      "http://purl.org/dc/terms/title": {
        "@language": "cs",
        "@value": "Nový test"
      },
      "http://www.w3.org/ns/dcat#contactPoint": {
        "http://xmlns.com/foaf/0.1/email": "user@example.cz",
        "http://xmlns.com/foaf/0.1/name": "Jakub"
      },
      "http://www.w3.org/ns/dcat#endpointURL": {
        "@id": "https://cssz.opendata.cz/sparql"
      }
    }];
    const catalogs = createCouchDbCatalog({"fetch": () => solrResponse,});
    const actual = await catalogs.fetchCatalogs(["cs"]);
    const expected = [{
      "iri": "https://data.gov.cz/zdroj/lokální-katalogy/6946049",
      "type": "CkanApiLkod",
      "publisher": {
        "iri": "https://data.gov.cz/zdroj/ovm/Poskytovatel1",
      },
      "title": "Nový test",
      "contactPoint": {
        "email": "user@example.cz",
        "name": "Jakub",
      },
      "endpointURL": "https://opendata.mfcr.cz/lod/sparql",
      "homepage": "https://cssz.opendata.cz/sparql",
    }];
    assert.deepEqual(actual, expected);
  });

});
