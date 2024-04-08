import { ROUTE } from "../route-name.mjs";
import { createTranslationService } from "../../service/translation-service.mjs";
import { prepareData } from "./local-catalog-list-model.mjs";
import { renderHtml } from "./local-catalog-list-view-html.mjs";
import localization from "./local-catalog-list-localization.mjs";

export default function createHandler(services, templates, languages) {
  const language = languages[0];
  // Navigation and translation.
  const local = localization[language];
  const navigation = services.navigation.view(language, ROUTE.LOCAL_CATALOG_LIST)
    .setNavigationData(local);
  // Load templates.
  templates.syncAddView(
    ROUTE.LOCAL_CATALOG_LIST,
    "/local-catalog-list/local-catalog-list-" + language + ".html");
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
  const data = await prepareData(services, languages);
  const serverQuery = {}; // We do not support query here yet.
  renderHtml(services, languages, serverQuery, data, reply);
}
