import handleRequest from "./v1/application.mjs";

/**
 * Register routes for API access.
 */
export default function registerRoutes(server) {
  registerV1(server);
};

function registerV1(server) {

  server.route({
    method: "GET",
    url: "/api/v1/applications-for-datasets",
    handler: async (request, reply) => await handleRequest(request, reply),
  });

}
