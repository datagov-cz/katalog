import configuration from "./configuration";
import {
  createHttpServer,
  registerRoutes,
  startServer,
} from "./http/http-server.mjs";
import { createDefaultHttpConnector } from "./connector/http-connector";
import { createServices } from "./service/service.mjs";

(async function main() {
  const server = await createHttpServer(configuration);
  const http = createDefaultHttpConnector();
  const services = await createServices(configuration, http);
  registerRoutes(configuration, server, services);
  startServer(server, configuration);
})();
