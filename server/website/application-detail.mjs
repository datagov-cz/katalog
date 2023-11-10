import {fetchApplicationWithLabels} from "../data-service.mjs"

export default async function handleRequest(templates, request, reply) {
  const urlQuery = decodeUrlQuery(request);
  const payload = await fetchApplicationWithLabels("cs", urlQuery["iri"]);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8").send(templates["application-detail"](payload));
}

function decodeUrlQuery(request) {
  return {
    "iri": request.query["iri"] ?? null,
  };
}
