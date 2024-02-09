import { ROUTE } from "../route-name.mjs";
import { createTranslationService } from "../../service/translation-service.mjs";
import { parseClientQuery, beforeLinkCallback } from "./application-list-query.mjs";
import { prepareData } from "./application-list-model.mjs";
import { renderHtml } from "./application-list-view-html.mjs";
import localization from "./application-list-localization.mjs";

export default function createHandler(services, templates, languages) {
  const language = languages[0];
  // Navigation and translation.
  const local = localization[language];
  const navigation = services.navigation.view(language, ROUTE.APPLICATION_LIST)
    .setNavigationData(local)
    .setBeforeLink(beforeLinkCallback);
  // Load templates.
  templates.syncAddView(
    ROUTE.APPLICATION_LIST,
    "/application-list/application-list-" + language + ".html");
  // Handler services.
  const handlerServices = {
    ...services,
    "translation": createTranslationService(local.translation),
    "navigation": navigation,
    "template": templates,
  };
  // Create handler.
  return {
    "path": local.path,
    "handler": (request, reply) =>
      handleRequest(handlerServices, languages, request, reply),
  };
}

async function handleRequest(services, languages, request, reply) {
  const serverQuery = parseClientQuery(services.navigation, request.query);
  const data = await prepareData(services, languages, serverQuery);
  renderHtml(services, languages, serverQuery, data, reply);
}
