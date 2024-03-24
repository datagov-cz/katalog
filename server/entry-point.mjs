import Fastify from "fastify";
import cors from "@fastify/cors";

import configuration from "./configuration.mjs";
import logger from "./logger.mjs";

import { createHttpConnector } from "./connector/http.mjs";
import { createSolrConnector } from "./connector/solr.mjs";
import { createCouchDbConnector } from "./connector/couchdb.mjs";

import { createCouchDbDataset } from "./data-source/couchdb-dataset.mjs";
import { createCouchDbLabel } from "./data-source/couchdb-label.mjs";
import { createCouchDbSuggestions } from "./data-source/couchdb-suggestions.mjs";
import { createSolrApplication } from "./data-source/solr-application.mjs";
import { createSolrSuggestion } from "./data-source/solr-suggestion.mjs";
import { createCouchDbStatic } from "./data-source/couchdb-static.mjs";

import { createNavigationService } from "./service/navigation-service.mjs";
import { createLabelService } from "./service/label-service.mjs";
import { createFacetService } from "./service/facet-service.mjs";
import { createDatasetService } from "./service/dataset-service.mjs";
import { createCronService } from "./service/cron-service.mjs";

import { registerHttpRoutes } from "./http/route.mjs";

(async function main() {
  const server = await createHttpServer();
  const services = await createServices();
  registerRoutes(server, services);
  startServer(server);
})();

async function createServices() {
  const http = createHttpConnector();
  const solr = createSolrConnector(configuration, http);
  const couchdb = createCouchDbConnector(configuration, http);

  const couchDbDataset = createCouchDbDataset(couchdb);
  const couchDbLabel = createCouchDbLabel(couchdb);
  const couchDbStatic = createCouchDbStatic(couchdb);
  const couchDbSuggestions = createCouchDbSuggestions(couchdb);
  const solrApplication = createSolrApplication(solr);
  const solrSuggestion = createSolrSuggestion(solr);

  const navigation = createNavigationService();
  const label = createLabelService(
    [couchDbLabel, couchDbSuggestions], 
    [couchDbStatic, couchDbSuggestions]);
  const facet = createFacetService(label);
  const dataset = createDatasetService(couchDbDataset);

  // Initialize static data.
  await label.reloadCache();

  // Start time-based services.
  createCronService(configuration, label).initialize();

  return {
    // Data sources
    "couchDbDataset": couchDbDataset,
    "couchDbLabel": couchDbDataset,
    "couchDbStatic": couchDbStatic,
    "couchDbSuggestions": couchDbSuggestions,
    "solrApplication": solrApplication,
    "solrSuggestion": solrSuggestion,
    // Services
    "navigation": navigation,
    "label": label,
    "facet": facet,
    "dataset": dataset,
  };
}

async function createHttpServer() {
  const application = Fastify({
    logger: logger,
    trustProxy: configuration.trustProxy,
  });
  await application.register(cors, {
    "origin": true,
  });
  return application;
}

function registerRoutes(server, services) {
  if (configuration.serverAssets) {
    registerAssetsRoutes(server);
  }
  registerHttpRoutes(server, services);
}

function registerAssetsRoutes(server) {
  server.register(import("@fastify/static"), {
    root: new URL("../assets", import.meta.url),
    prefix: "/aplikace/assets/",
    decorateReply: false
  });
  if (configuration.designSystemFolder) {
    logger.info("Serving design system assets from given directory.")
    server.register(import("@fastify/static"), {
      root: configuration.designSystemFolder,
      prefix: "/design-system/",
      decorateReply: false
    });
  }
}

function startServer(server) {
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
