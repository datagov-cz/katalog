import Fastify from "fastify";

import configuration from "./configuration.mjs";
import logger from "./logger.mjs";

import registerApiRoutes from "./api/api-routes.mjs";
import registerWebsiteRoutes from "./website/website-routes.mjs";

(function main() {
  const server = createServer();
  initializeTemplates();
  registerRoutes(server);
  startServer(server);
})();

function createServer() {
  return Fastify({
    logger: logger,
    trustProxy: configuration.trustProxy,
  });
}

function registerRoutes(server) {
  if (configuration.serverAssets) {
    registerAssetsRoutes(server);
  }
  registerApiRoutes(server);
  registerWebsiteRoutes(server);
}

function registerAssetsRoutes(server) {
  server.register(import("@fastify/static"), {
    root: new URL("../assets", import.meta.url),
    prefix: "/assets/"
  });
}

function startServer(server) {
  server.listen({
    port: configuration.port,
    host: configuration.host,
  }, function (error, address) {
    if (error) {
      server.log.error(error);
      process.exit(1);
    }
  });
}
