import Fastify from "fastify";
import cors from "@fastify/cors";
import logger from "../logger.mjs";

import { registerHttpRoutes } from "./route.mjs";

export async function createHttpServer(configuration) {
  const application = Fastify({
    logger: logger,
    trustProxy: configuration.trustProxy,
  });
  await application.register(cors, {
    "origin": true,
  });
  return application;
}

export function registerRoutes(configuration, server, services) {
  if (configuration.serverAssets) {
    registerAssetsRoutes(configuration, server);
  }
  registerHttpRoutes(server, services);
}

function registerAssetsRoutes(configuration, server) {
  server.register(import("@fastify/static"), {
    root: new URL("../../assets", import.meta.url),
    prefix: "/assets/catalog/",
    decorateReply: false
  });
  if (configuration.designSystemFolder) {
    logger.info("Serving design system assets from the given directory.")
    server.register(import("@fastify/static"), {
      root: configuration.designSystemFolder,
      prefix: "/assets/design-system/",
      decorateReply: false
    });
  }
}

export function startServer(server, configuration) {
  server.listen({
    port: configuration.port,
    host: configuration.host,
  }, function (error) {
    if (error) {
      server.log.error(error);
      process.exit(1);
    }
  });
}
