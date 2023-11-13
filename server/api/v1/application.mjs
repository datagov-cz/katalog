
import { fetchApplicationsWithDatasets } from "../../data-service.mjs"

export default async function handleRequest(request, reply) {
  const query = decodeUrlQuery(request);
  console.log(query);
  const payload = await fetchApplicationsWithDatasets(query["language"], query["dataset"]);
  reply
    .code(200)
    .header("Content-Type", "text/json; charset=utf-8").send(payload);
}

function decodeUrlQuery(request) {
  return {
    "dataset": asArray(request.query["iri"]),
    "language": asArray(request.query["language"] ?? "cs") ,
  };
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

