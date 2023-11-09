import {getTemplatesForLanguage} from "./templates-service.mjs";
import applicationListHandler from "./website/application-list.mjs";
import applicationDetailHandler from "./website/application-detail.mjs";


/**
 * Register routes for HTML websites.
 */
export default function registerRoutes(server) {

  server.route({
    method: "GET",
    url: "/aplikace",
    handler: async (request, reply) => {
      const templates = getTemplatesForLanguage("cs");
      await applicationListHandler(templates, request, reply);
    }
  });

  server.route({
    method: "GET",
    url: "/detail-aplikace",
    handler: async (request, reply) => {
      const templates = getTemplatesForLanguage("cs");
      await applicationDetailHandler(templates, request, reply);
    }
  });

};

