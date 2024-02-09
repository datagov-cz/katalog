export default async function handleRequest(services, request, reply) {
  const query = parseQuery(request);
  let applications = [];
  if (isQueryValid(query)) {
    applications = await services.solrApplication.fetchApplicationsWithDatasets(
      query["languages"], query["datasets"]);
  }
  const payload = {
    "applications": applications,
  };
  reply
    .code(200)
    .header("Content-Type", "text/json; charset=utf-8").send(payload);
}

function parseQuery(request) {
  return {
    "datasets": asArray(request.query["iri"]),
    "languages": asArray(request.query["language"] ?? "cs") ,
  };
}

function isQueryValid(query) {
  return query["datasets"].length > 0;
}

function asArray(value) {
  if (value === undefined || value === null) {
    return [];
  } else if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}
