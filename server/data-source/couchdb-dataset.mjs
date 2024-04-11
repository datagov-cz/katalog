import { getId, getTypes, getEntityByIri, getString, getStrings, getResource, getResources, getPlainStrings, getPlainString, getEntityByType } from "./shared/jsonld.mjs";
import { selectForLanguages } from "./shared/couchdb-response.mjs";
import { DCTERMS, DCAT, VCARD, SKOS, SGOV, EUA, ADMS, FOAF, OWL, NKOD, PU, SPDX } from "./shared/vocabulary.mjs";

export function createCouchDbDataset(couchDbConnector) {
  return {
    "fetchDataset": (languages, query) =>
      fetchDataset(couchDbConnector, languages, query),
    "fetchDatasetPreview": (languages, iri) =>
      fetchDatasetPreview(couchDbConnector, languages, iri),
  };
}

async function fetchDataset(couchDbConnector, languages, query) {
  const {
    iri,
    distributionOffset,
    distributionLimit,
  } = query;

  const response = await couchDbConnector.fetch("datasets", iri);
  if (response["error"] !== undefined) {
    // We assume it is missing.
    return null;
  }
  const dataset = jsonldToDataset(response["jsonld"], iri);

  // Language based filtering.
  dataset.title = selectForLanguages(languages, dataset.title);
  dataset.description = selectForLanguages(languages, dataset.description);
  dataset.keywords = dataset.keywords
    .map(keyword => keyword.cs)
    .filter(value => value !== undefined);

  dataset.distributions.sort();
  dataset.distributionsFound = dataset.distributions.length;
  dataset.distributions = dataset.distributions.slice(
    distributionOffset, distributionLimit);

  dataset.distributions = dataset.distributions
    .map(iri => jsonldToDistribution(response["jsonld"], iri))
    // TODO Perhaps we should not ignore?
    .filter(distribution => distribution != null);

  dataset.distributions.forEach(distribution => {
    distribution.title = selectForLanguages(languages, distribution.title);
    distribution.description = selectForLanguages(languages, distribution.description);
    if (distribution.dataServiceTitle) {
      distribution.dataServiceTitle = selectForLanguages(languages, distribution.dataServiceTitle);
    }
  });

  return dataset;
}

function jsonldToDataset(jsonld, iri) {
  const entity = getEntityByIri(jsonld, iri);
  if (entity === null) {
    // Dataset not found.
    return null;
  }
  const result = createEmptyDataset(iri);
  loadDatasetMandatory(entity, result);
  loadDatasetRecommended(jsonld, entity, result);
  loadDatasetThemes(jsonld, entity, result);
  loadDatasetTemporal(jsonld, entity, result);
  loadDatasetOptional(entity, result);
  loadDatasetNationalCatalog(jsonld, entity, result);
  return result;
}

function createEmptyDataset(iri) {
  return {
    "iri": iri,
    "title": null,
    "description": null,
    "contactPoints": [],
    "distributions": [],
    "distributionsFound": 0,
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
    "localCatalog": null,
    "isFromForm": false,
    "isFromCatalog": false,
    "semanticThemes": [],
    "isFromVdf": false,
    "isCodelist": false,
    "vdfOriginator": null,
  }
}

function loadDatasetMandatory(entity, dataset) {
  dataset.title = getString(entity, DCTERMS.title);
  dataset.description = getString(entity, DCTERMS.description);
}

function loadDatasetRecommended(jsonld, entity, dataset) {
  dataset.contactPoints = loadContactPoints(jsonld, entity);
  dataset.distributions = getResources(entity, DCAT.distribution);
  dataset.keywords = getStrings(entity, DCAT.keyword);
  dataset.publisher = getResource(entity, DCTERMS.publisher);
}

function loadContactPoints(jsonld, entity) {
  return getResources(entity, DCAT.contactPoint)
    .map(iri => getEntityByIri(jsonld, iri))
    .filter(value => value !== null)
    .map(contactEntity => {
      let email = getResource(contactEntity, VCARD.hasEmail);
      if (email && email.startsWith("mailto:")) {
        email = email.substring("mailto:".length);
      }
      return {
        "iri": getId(contactEntity),
        "title": getString(contactEntity, VCARD.fn),
        "email": email,
      }
    }
    );
}

function loadDatasetThemes(jsonld, entity, dataset) {
  for (const iri of getResources(entity, DCAT.theme)) {
    // We split the themes based on schema they belong to.
    const entity = getEntityByIri(jsonld, iri);
    if (entity === undefined) {
      dataset.themes.push(iri);
      continue;
    }
    const inScheme = getResources(entity, SKOS.inScheme);
    if (inScheme.includes(EUA.dataTheme)) {
      dataset.datasetThemes.push(iri);
    } else if (inScheme.includes(SGOV.ObjectType)) {
      dataset.semanticThemes.push(iri);
    } else {
      dataset.themes.push(iri);
    }
  }
}

function loadDatasetTemporal(jsonld, entity, dataset) {
  const iri = getResource(entity, DCTERMS.temporal);
  if (iri === undefined) {
    return;
  }
  const temporal = getEntityByIri(jsonld, iri);
  if (temporal === undefined) {
    return;
  }
  dataset.temporal = {
    "startDate": getValue(temporal, DCAT.startDate),
    "endDate": getValue(temporal, DCAT.endDate),
  };
}

function loadDatasetOptional(entity, dataset) {
  dataset.accessRights = getResources(entity, DCTERMS.accessRights);
  dataset.conformsTo = getResources(entity, DCTERMS.conformsTo);
  dataset.documentation = getResources(entity, FOAF.page);
  dataset.frequency = getResource(entity, DCTERMS.accrualPeriodicity);
  dataset.hasVersion = getResources(entity, DCTERMS.hasVersion);
  dataset.identifier = getPlainStrings(entity, DCTERMS.identifier);
  dataset.isVersionOf = getResources(entity, DCTERMS.isVersionOf);
  dataset.landingPage = getResources(entity, DCAT.landingPage);
  dataset.language = getResources(entity, DCTERMS.language);
  dataset.otherIdentifier = getResources(entity, ADMS.identifier);
  dataset.provenance = getResources(entity, DCTERMS.provenance);
  dataset.relation = getResources(entity, DCTERMS.relation);
  dataset.issued = getPlainStrings(entity, DCTERMS.issued);
  dataset.sample = getResources(entity, ADMS.sample);
  dataset.source = getResources(entity, DCTERMS.source);
  dataset.spatial = getResources(entity, DCTERMS.spatial);
  dataset.type = getPlainStrings(entity, DCTERMS.type);
  dataset.modified = getPlainStrings(entity, DCTERMS.modified);
  dataset.version = getPlainStrings(entity, OWL.versionInfo);
  dataset.versionNotes = getPlainStrings(entity, ADMS.versionNotes);
  dataset.temporalResolution = getPlainString(entity, DCAT.temporalResolution);
  const resolution = getPlainString(entity, DCAT.spatialResolutionInMeters);
  dataset.spatialResolutionInMeters = resolution === undefined ?
    undefined : Number(resolution);
}

function loadDatasetNationalCatalog(jsonld, entity, dataset) {
  dataset.datasets = getResources(entity, DCTERMS.hasPart);
  dataset.parentDataset = getResource(entity, DCTERMS.isPartOf);
  const catalog = getEntityByType(jsonld, DCAT.Catalog);
  if (catalog !== null) {
    dataset.catalog = getId(catalog);
  }
  const catalogSource = getEntityByType(jsonld, DCAT.CatalogRecord);
  if (catalogSource !== null) {
    dataset.catalogSource = getId(catalogSource);
  }
  dataset.localCatalog = getResource(entity, NKOD.lkod);
  const types = getTypes(entity);
  dataset.isFromForm = types.includes(NKOD.SourceForm);
  dataset.isFromCatalog = types.includes(NKOD.SourceLkod);
  dataset.isFromVDF = types.includes(NKOD.Vdf);
  dataset.isCodelist = types.includes(NKOD.CodeList);
  dataset.vdfOriginator = getResource(entity, NKOD.originator);
}

function jsonldToDistribution(jsonld, iri) {
  const entity = getEntityByIri(jsonld, iri);
  if (entity === null) {
    return null;
  }

  const distribution = {
    "iri": getId(entity),
    "title": getString(entity, DCTERMS.title),
    "accessURL": getResource(entity, DCAT.accessURL),
    "description": getString(entity, DCTERMS.description),
    "format": getResource(entity, DCTERMS.format),
    "license": getResource(entity, DCTERMS.license),
    "byteSize": getPlainString(entity, DCAT.byteSize),
    "checksum": getPlainStrings(entity, SPDX.checksum),
    "documentation": getResources(entity, FOAF.page),
    "downloadURL": getResources(entity, DCAT.downloadURL),
    "language": getResources(entity, DCTERMS.language),
    "conformsTo": getResources(entity, DCTERMS.conformsTo),
    "mediaType": getResource(entity, DCAT.mediaType),
    "issued": getPlainString(entity, DCTERMS.issued),
    "rights": getResource(entity, DCTERMS.rights),
    "status": getResource(entity, ADMS.status),
    "modified": getResource(entity, DCTERMS.modified),
    "packageFormat": getResource(entity, DCAT.packageFormat),
    "compressFormat": getResource(entity, DCAT.compressFormat),
    "type": "Distribution",
    "legal": loadDistributionLegal(jsonld, entity),
  };

  const accessServiceIri = getResource(entity, DCAT.accessService);
  if (accessServiceIri === null) {
    return distribution;
  }

  return {
    ...distribution,
    "type": "DataService",
    ...loadDistributionDataService(jsonld, iri),
  };
}

function loadDistributionLegal(jsonld, distribution) {
  const iri = getResource(distribution, PU.specification);
  const entity = getEntityByIri(jsonld, iri);
  if (entity === null) {
    return createDefaultLegal();
  }
  return {
    "authorship": getResource(entity, PU.authorship),
    "author": getString(entity, PU.author),
    "databaseAuthorship": getResource(entity, PU.databaseAuthorship),
    "databaseAuthor": getString(entity, PU.databaseAuthor),
    "protectedDatabase": getResource(entity, PU.protectedDatabase),
    "personalData": getResource(entity, PU.personalData),
  };
}

function createDefaultLegal() {
  return {
    "authorship": "missing",
    "author": null,
    "databaseAuthorship": "missing",
    "databaseAuthor": null,
    "protectedDatabase": "missing",
    "personalData": "missing",
  };
}

function loadDistributionDataService(jsonld, iri) {
  const entity = getEntityByIri(jsonld, iri);
  if (dataService === undefined) {
    return createEmptyDataService();
  }
  return {
    "dataService": accessServiceIri,
    "dataServiceTitle": getString(entity, DCTERMS.title),
    "endpointDescription": getResource(entity, DCAT.endpointDescription),
    "endpointURL": getResource(entity, DCAT.endpointURL),
    "dataServiceConformsTo": getResources(entity, DCTERMS.conformsTo),
  }
}

function createEmptyDataService() {
  return {
    "dataService": accessServiceIri,
    "dataServiceTitle": null,
    "endpointDescription": null,
    "endpointURL": null,
    "dataServiceConformsTo": [],
  };
}

async function fetchDatasetPreview(couchDbConnector, languages, iri) {
  const response = await couchDbConnector.fetch("datasets", iri);
  if (response["error"] !== undefined) {
    // We assume it is missing.
    return null;
  }
  const dataset = jsonldToDataset(response["jsonld"], iri);
  return {
    "iri": iri,
    "title": selectForLanguages(languages, dataset.title),
    "description": selectForLanguages(languages, dataset.description),
  };
}
