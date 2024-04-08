import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(
    services.configuration, services.navigation,
    services.translation, languages, query, data);
  const template = services.template.view(ROUTE.LOCAL_CATALOG_LIST);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
}

export function prepareTemplateData(configuration, navigation, translation, languages, query, data) {
  prepareCatalogsInPlace(configuration, translation, data["catalogs"])
  return {
    "navigation": components.createNavigationData(navigation, languages, query),
    "footer": components.createFooterData(),
    "message": translation.translate("items-found", data["catalogs"].length),
    "catalogs": data["catalogs"],
  };
}

function prepareCatalogsInPlace(configuration, translation, catalogs) {
  for (const catalog of catalogs) {
    catalog.publisher.describeUrl = configuration.client.dereferenceTemplate
      .replace("{}", encodeURIComponent(catalog.publisher.iri));
    catalog.describeUrl = configuration.client.dereferenceTemplate
      .replace("{}", encodeURIComponent(catalog.iri));
    catalog.deleteUrl = configuration.client.catalogFormUrl
      + translation.translate("url-remove-link")
      + encodeURIComponent(catalog.iri);
  }
}
