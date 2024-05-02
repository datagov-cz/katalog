
export default function createHandler(services) {
  // Create handler.
  return {
    "path": "api/v2/statistics",
    "handler": (request, reply) => handleRequest(services, request, reply),
  };
}

async function handleRequest(services, request, reply) {
  reply
    .code(200)
    .header("Content-Type", "application/json; charset=utf-8")
    .send({
      "data": {
        "numberOfDatasets": 7953,
        "numberOfApplications": 7953,
        "numberOfPublishers": 317,
        "numberOfKeywords": 3738
      }
    });
}
