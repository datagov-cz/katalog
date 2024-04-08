export function createCouchDbVdf(couchDbConnector) {
  return {
    "fetchPublishersVdf": () =>
      fetchPublishersVdf(couchDbConnector)
  };
}

async function fetchPublishersVdf(couchDbConnector) {
  const response = await couchDbConnector.fetch("static", "publishers_vdf");
  // TODO Parse!
  return response;
}

