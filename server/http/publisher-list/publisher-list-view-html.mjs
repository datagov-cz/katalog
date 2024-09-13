import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(
    services.configuration, services.navigation,
    services.translation, languages, query, data);
  const template = services.template.view(ROUTE.PUBLISHER_LIST);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
}

export function prepareTemplateData(configuration, navigation, translation, languages, query, data) {
  preparePublishersInPlace(configuration, navigation, translation, data["publishers"])
  return {
    "head": components.createHeadData(configuration),
    "navigation": components.createNavigationData(navigation, languages, query, { publishersActive: true }),
    "footer": components.createFooterData(),
    "message": translation.translate("items-found", data["publishers"].length),
    "publishers": data["publishers"],
  };
}

function preparePublishersInPlace(configuration, navigation, translation, publishers) {
  const datasetListNavigation = navigation.changeView(ROUTE.DATASET_LIST);
  for (const publisher of publishers) {
    publisher["href"] = datasetListNavigation.linkFromServer({
      "publisher": publisher["iri"]
    });
    publisher["dashboardDaily"] =
      configuration.client.publisherDashboardDailyTemplate
        .replace("{}", publisher["iri"]);
    publisher["dashboardMonthly"] =
      configuration.client.publisherDashboardMonthlyTemplate
        .replace("{}", publisher["iri"]);
    publisher.message =
      translation.translate("datasets-found", publisher.count);
    //
    publisher.badges = {
      "vdf": publisher.vdfOriginator || publisher.vdfPublisher,
      "vdfOriginator": publisher.vdfOriginator,
      "vdfPublisher": publisher.vdfPublisher,
    };
  }
}


