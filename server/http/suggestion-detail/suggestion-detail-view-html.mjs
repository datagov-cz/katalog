import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(services.navigation, languages, query, data);
  const template = services.template.view(ROUTE.SUGGESTION_DETAIL);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
}

export function prepareTemplateData(navigation, languages, query, data) {
  const language = languages[0];
  const suggestion = prepareSuggestion(navigation, language, data);
  return {
    "navigation": components.createNavigationData(navigation, languages, query, true),
    "footer": components.createFooterData(),
    "suggestion": suggestion,
  };
}

function prepareSuggestion(navigation, language, suggestion) {
  updateCodelistInPlace(navigation, suggestion["themes"], "theme");
  return {
    "iri": suggestion["iri"],
    "title": suggestion["title"],
    "description": suggestion["description"],
    "themes": suggestion["themes"],
    "created": formatDate(language, suggestion["created"]),
    "published": formatDate(language, suggestion["published"]),
    "modified": formatDate(language, suggestion["modified"]),
    "mandatory_106": suggestion["mandatory_106"],
    "obstacle_special_regulation": suggestion["obstacle_special_regulation"],
    "obstacle_106": suggestion["obstacle_106"],
    "publisher": {
      "iri": suggestion["publisher"]["iri"],
      "title": suggestion["publisher"]["title"],
    },
  }
}

function formatDate(language, value) {
  const date = new Date(value);
  return date.toLocaleDateString(language);
}

function updateCodelistInPlace(navigation, items, name) {
  const listNavigation = navigation.changeView(ROUTE.SUGGESTION_LIST);
  for (const item of items) {
    item["href"] = listNavigation.linkFromServer({ [name]: item["iri"] });
  }
}
