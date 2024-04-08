
export async function prepareData(services, languages) {
  // https://data.gov.cz/api/v2/vdf/publishers
  const publishers = await services.solrPublisher.fetchPublishers();
  await services.label.addLabelToResources(languages, publishers);
  return {
    "publishers": publishers,
  };
};
