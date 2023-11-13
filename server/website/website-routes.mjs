import {initializeTemplates, getTemplatesForLanguage} from "./templates-service.mjs";
import applicationListHandler from "./application-list.mjs";
import applicationDetailHandler from "./application-detail.mjs";

initializeTemplates();

/**
 * Register routes for HTML websites.
 */
export default function registerRoutes(server) {

  server.route({
    method: "GET",
    url: "/",
    handler: (request, reply) => reply.redirect("/aplikace")
  });

  server.route({
    method: "GET",
    url: "/aplikace",
    handler: (request, reply) => applicationListHandler("cs", request, reply)
  });

  server.route({
    method: "GET",
    url: "/applications",
    handler: (request, reply) => applicationListHandler("en", request, reply)
  });

  server.route({
    method: "GET",
    url: "/detail-aplikace",
    handler: (request, reply) => applicationDetailHandler("cs", request, reply)
  });

  server.route({
    method: "GET",
    url: "/application-detail",
    handler: (request, reply) => applicationDetailHandler("en", request, reply)
  });

};

