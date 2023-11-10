import handleRequest from "./application.mjs";

/**
 * Register routes for API access.
 */
export default function registerRoutes(server) {

  server.route({
    method: "GET",
    url: "/api/v1/applications-for-datasets",
    handler: async (request, reply) => {
      await handleRequest(request, reply);
    }
  });

};
