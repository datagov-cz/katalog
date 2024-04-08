import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

export function renderHtml(services, languages, query, data, reply) {
  const templateData = prepareTemplateData(
    services.configuration, services.translation, services.navigation,
    languages, query, data);
  const template = services.template.view(ROUTE.DATASET_DETAIL);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8")
    .send(template(templateData));
    // .header("Content-Type", "application/json; charset=utf-8")
    // .send({ query, "data": templateData, "source": data });
}

export function prepareTemplateData(configuration, translation, navigation, languages, query, data) {
  return {
    "navigation": components.createNavigationData(navigation, languages, query),
    "footer": components.createFooterData(),
    "dataset": prepareDataset(configuration, translation, navigation, data),
    // "distributions": prepareDistributions(),
    // "application": prepareApplications(),
    // "series": prepareSeries(),
    // "vdf": {},
  };
}

function prepareDataset(configuration, translation, navigation, { dataset }) {
  const datasetListNavigation = navigation.changeView(ROUTE.DATASET_LIST);

  return {
    "heading": {
      "title": dataset.title,
      "openUrl": configuration.client.dereferenceTemplate
        .replace("{}", encodeURIComponent(dataset.iri)),
      "copyUrl": configuration.client.catalogFormUrl
        + translation.translate("url-copy-dataset")
        + encodeURIComponent(dataset.iri),
      // TODO We need delete for a catalog.
      "deleteUrl": configuration.client.catalogFormUrl
        + translation.translate("url-delete-dataset")
        + encodeURIComponent(dataset.iri),
    },
    "publisher": {
      "label": dataset.publisher.label,
      "href": datasetListNavigation.linkFromServer({
        "publisher": [dataset.publisher.iri]
      }),
    },
    "description": dataset.description,
    "keywords": dataset.keywords.map(keyword => ({
      "label": keyword,
      "href": datasetListNavigation.linkFromServer({
        "keyword": [keyword]
      }),
    })),
    // First column
    "datasetTopic": dataset.datasetThemes.map(item => ({
      ...item,
      "link": datasetListNavigation.linkFromServer({
        "theme": [item.iri]
      }),
    })),
    "themes": dataset.themes.map(item => ({
      ...item,
      "link": datasetListNavigation.linkFromServer({
        "theme": [item.iri]
      }),
    })),
    // Second column
    "semanticRelations": [],
    "semanticConcepts": [],
    "spatial": dataset.spatial,
    "spatialResolution": dataset.spatialResolutionInMeters,
    "temporal": {
      "coverage": ""
    },
    // Third column
    "documentation": {

    },
    "contact": {

    },
    "specification": {

    },
    // Fourth column
    "frequency": dataset.frequency,
  };
}

function prepareApplications() {
  return {
    "items": [{
      "href": "",
      "label": "",
      "description": "",
    }],
  };
}

function prepareDistributions() {
  return {

  };
}

function prepareSeries() {
  return {

  };
}
