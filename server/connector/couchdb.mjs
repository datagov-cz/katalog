export function createCouchDbConnector(couchDbUrl, http) {
  return {
    "fetch": (database, identifier) =>
      executeQuery(couchDbUrl, http, database, identifier),
  };
}

async function executeQuery(couchDbUrl, http, database, identifier) {
  const url = couchDbUrl + "/" + database + "/" + encodeURIComponent(identifier);
  try {
    const response = await http.fetch(url);
    return await response.json();
  } catch (error) {
    throw error;
  }
}
