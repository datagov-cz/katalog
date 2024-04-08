
export default function createHandler(services) {
  // Create handler.
  return {
    "path": "api/v2/quality",
    "handler": (request, reply) => handleRequest(services, request, reply),
  };
}

async function handleRequest(services, request, reply) {
  const iri = request.query.iri ?? null;
  const languages = ["cs", "en"];
  const quality =  await services.sparqlQuality.fetchQuality(languages, iri);
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send(quality);
}
