import { ROUTE } from "../route-name.mjs";
import { createTranslationService } from "../../service/translation-service.mjs";
import { parseClientQuery } from "./suggestion-detail-query.mjs";
import { prepareData } from "./suggestion-detail-model.mjs";
import { renderHtml } from "./suggestion-detail-view-html.mjs";
import localization from "./suggestion-detail-localization.mjs";

export default function createHandler(services, templates, languages) {
  const language = languages[0];
  // Navigation and translation.
  const local = localization[language];
  const navigation = services.navigation.view(language, ROUTE.SUGGESTION_DETAIL)
    .setNavigationData(local);

  // Load templates.
  templates.syncAddView(
    ROUTE.SUGGESTION_DETAIL,
    "/suggestion-detail/suggestion-detail-" + language + ".html");
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
