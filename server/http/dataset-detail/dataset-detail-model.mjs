const DISTRIBUTION_PAGE_SIZE = 2;

export async function prepareData(services, languages, query) {
  const dataset = await services.couchDbDataset.fetchDataset(languages, {
    "iri": query.iri,
    "distributionOffset": query.distributionPage * DISTRIBUTION_PAGE_SIZE,
    "distributionLimit": DISTRIBUTION_PAGE_SIZE,
  });

  if (dataset == null) {
    return null;
  }

  prepareDataset(dataset);

  const resourcesToAddLabelsTo = [
    dataset.publisher,
    ...dataset.datasetThemes,
    ...dataset.accessRights,
    dataset.frequency,
    ...dataset.spatial,
  ];

  const applications = await services.solrApplication.fetchApplicationsWithDatasets(languages, [query.iri]);

  const series = await services.solrDataset.fetchDatasets(languages, {
    "searchQuery": null,
    "publisher": [],
    "theme": [],
    "keyword": [],
    "format": [],
    "dataServiceType": [],
    "temporalStart": null,
    "temporalEnd": null,
    "vdfPublicData": null,
    "vdfCodelist": null,
    "isPartOf": [query.iri],
    "sort": "title",
    "sortDirection": "asc",
    "offset": 0,
    "limit": -1,
  });

  await services.label.addLabelToResources(languages, resourcesToAddLabelsTo);

  // https://oha02.dia.gov.cz/api/v2/dataset?
  //  language=en&keywordLimit=0&publisherLimit=0&fileTypeLimit=0&dataServiceTypeLimit=0&themeLimit=0&isPartOfLimit=0&
  //  isPartOf={}&offset=0&limit=10&sort=

  // https://oha02.dia.gov.cz/api/v2/vdf/dataset?iri={}

  // https://oha02.dia.gov.cz/api/aplikace/v1/applications-for-datasets?iri={}


  return {
    "dataset": { ...dataset, "distributions": [] },
    applications,
    series,
  };
};

function prepareDataset(dataset) {
  dataset.datasetThemes = dataset.datasetThemes.map(iri => ({ iri }));
  dataset.accessRights = dataset.accessRights.map(iri => ({ iri }));
  if (dataset.frequency !== null) {
    dataset.frequency = { "iri": dataset.frequency };
  }
  dataset.publisher = {
    "iri": dataset.publisher,
  };
  dataset.spatial = dataset.spatial.map(iri => ({ iri }));
}
