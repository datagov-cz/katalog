
import { fetchApplicationsWithDatasets } from "../data-service.mjs"

export default async function handleRequest(request, reply) {
  const urlQuery = decodeUrlQuery(request);
  const payload = await fetchApplicationsWithDatasets("cs", urlQuery["dataset"]);
  reply
    .code(200)
    .header("Content-Type", "text/json; charset=utf-8").send(payload);
}

function decodeUrlQuery(request) {
  return {
    "dataset": request.query["dataset"] ?? [],
  };
}
