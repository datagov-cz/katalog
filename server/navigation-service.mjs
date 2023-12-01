import { listLanguages, getLocalization } from "./localization-service.mjs";

export function createNavigationData(viewName, query, beforeLink) {
  const result = {};
  for (const language of listLanguages()) {
    const localization = getLocalization(language).view(viewName, beforeLink);
    const href = localization.linkFromServer(query);
    result[language] = href;
  }
  return result;
}

