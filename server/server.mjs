import Fastify from "fastify";
import cors from "@fastify/cors";

import configuration from "./configuration.mjs";
import logger from "./logger.mjs";

import registerApiRoutes from "./api/api-routes.mjs";
import registerWebsiteRoutes from "./website/website-routes.mjs";

(async function main() {
  const server = await createServer();
  registerRoutes(server);
  startServer(server);
})();

async function createServer() {
  const application = Fastify({
    logger: logger,
    trustProxy: configuration.trustProxy,
  });
  await application.register(cors, { 
    "origin": true,
  });
  return application;
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
    prefix: "/aplikace/assets/"
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
