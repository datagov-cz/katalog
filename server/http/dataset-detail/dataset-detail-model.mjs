
export async function prepareData(services, languages, query) {
  const dataset = await services.couchDbDataset.fetchDataset(languages, {
    "iri": query.iri,
    "distributionOffset": query.distributionPage * query.distributionPageSize,
    "distributionLimit": query.distributionPageSize,
  });
  const applications = await fetchApplications(services, languages, query.iri);

  const series = await fetchDatasetSeries(services, languages, query.iri);

  if (dataset == null) {
    return null;
  }

  prepareDataset(dataset);
  const distributions = prepareDistributions(dataset);

  const resourcesToAddLabelsTo = [
    dataset.publisher,
    ...dataset.themes,
    ...dataset.euroVocThemes,
    ...dataset.semanticThemes,
    ...dataset.accessRights,
    dataset.frequency,
    ...dataset.spatial,
    ...distributions.items.map(item => item.format),
  ];

  const resourcesToAddLabelsToWithNoDefault = [
    ...dataset.conformsTo,
    ...distributions.items.map(item => item.mediaType),
  ];

  await services.label.addLabelToResources(languages, resourcesToAddLabelsTo);

  // Resources without the need for default value.
  await services.label.addLabelToResources(languages, resourcesToAddLabelsToWithNoDefault, () => null);

  return {
    dataset,
    distributions,
    applications,
    series,
  };
};

function prepareDataset(dataset) {
  dataset.themes = dataset.themes.map(iri => ({ iri }));
  dataset.euroVocThemes = dataset.euroVocThemes.map(iri => ({ iri }));
  dataset.semanticThemes = dataset.semanticThemes.map(iri => ({ iri }));

  dataset.accessRights = dataset.accessRights.map(iri => ({ iri }));
  if (dataset.frequency !== null) {
    dataset.frequency = { "iri": dataset.frequency };
  }
  dataset.publisher = {
    "iri": dataset.publisher,
  };
  dataset.spatial = dataset.spatial.map(iri => ({ iri }));
  dataset.conformsTo = dataset.conformsTo.map(iri => ({iri}));
}

function prepareDistributions(dataset) {
  const distributions = {
    "total": dataset.distributionsFound,
    "items": dataset.distributions,
  };
  delete dataset.distributionsFound;
  delete dataset.distributions;
  for (const distribution of distributions.items) {
    distribution.format = { "iri": distribution.format };
    distribution.mediaType = distribution.mediaType === null
      ? null
      : { "iri": distribution.mediaType };
  }
  return distributions;
}

async function fetchApplications(services, languages, datasetIri) {
  return await services.solrApplication.fetchApplicationsWithDatasets(languages, [datasetIri])
}

async function fetchDatasetSeries(services, languages, datasetIri) {
  const response = await services.solrDataset.fetchDatasets(languages, {
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
    "isPartOf": [datasetIri],
    "sort": "title",
    "sortDirection": "asc",
    "offset": 0,
    "limit": 25, // Limit based on default page size.
  });
  return {
    "total": response.found,
    "items": response.documents.map(item => ({
      "iri": item.iri,
      "title": item.title,
      "description": item.description,
      "fileType": [item.file_type ?? []].map(iri => ({ iri })),
    })),
  }
}
