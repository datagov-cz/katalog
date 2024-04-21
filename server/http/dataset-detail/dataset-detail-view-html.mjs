import { ROUTE } from "../route-name.mjs";
import * as components from "../../component/index.mjs";

const SPARQL_SCHEMA = "https://www.w3.org/TR/sparql11-protocol/";

const PU_PREFIX = "https://data.gov.cz/podmínky-užití/";

const PERSONAL_DATA_MAP = {
  [PU_PREFIX + "obsahuje-osobní-údaje/"]: () => ({
    "label": "with-personal-data-label",
    "iconColor": "warning",
    "iconTitle": "with-personal-data-comment",
  }),
  [PU_PREFIX + "neobsahuje-osobní-údaje/"]: () => ({
    "label": "without-personal-data-label",
    "iconColor": "alright",
    "iconTitle": "without-personal-data-comment",
  }),
  [PU_PREFIX + "není-specifikováno-zda-obsahuje-osobní-údaje/"]: () => ({
    "label": "unspecified-personal-data-label",
    "iconColor": "warning",
    "iconTitle": "unspecified-personal-data-comment",
  }),
  [null]: () => ({
    "label": "missing-personal-data-information-label",
    "iconColor": "danger",
    "iconTitle": "missing-personal-data-information-comment",
  }),
}

const AUTHORSHIP_MAP = {
  [PU_PREFIX + "neobsahuje-autorská-díla/"]: () => ({
    "label": "without-authorship",
    "iconColor": "alright",
    "iconTitle": "without-authorship-comment",
  }),
  [PU_PREFIX + "obsahuje-více-autorských-děl/"]: () => ({
    "label": "with-multiple-authorship",
    "iconColor": "warning",
    "iconTitle": "with-authorship-comment",
  }),
  "https://creativecommons.org/licenses/by/4.0/": (author) => ({
    "label": "ccby-authorship",
    "iconColor": "warning",
    "iconTitle": "ccby-authorship-comment",
    "author": author,
  }),
  [null]: () => ({
    "label": "missing-authorship",
    "iconColor": "danger",
    "iconTitle": "missing-authorship-comment",
  }),
}

const DATABASE_AUTHORSHIP_MAP = {
  [PU_PREFIX + "není-autorskoprávně-chráněnou-databází/"]: () => ({
    "label": "without-dataset-authorship",
    "iconColor": "alright",
    "iconTitle": "without-dataset-authorship-comment",
  }),
  "https://creativecommons.org/licenses/by/4.0/": (author) => ({
    "label": "ccby-dataset-authorship",
    "iconColor": "warning",
    "iconTitle": "ccby-dataset-authorship-comment",
    "author": author
  }),
  [null]: () => ({
    "label": "missing-dataset-authorship",
    "iconColor": "danger",
    "iconTitle": "missing-dataset-authorship-comment",
  }),
}

const PROTECTED_DATABASE_AUTHORSHIP_MAP = {
  [PU_PREFIX + "není-chráněna-zvláštním-právem-pořizovatele-databáze/"]: () => ({
    "label": "without-protected-dataset-authorship",
    "iconColor": "alright",
    "iconTitle": "without-protected-dataset-authorship-comment",
  }),
  "https://creativecommons.org/publicdomain/zero/1.0/": () => ({
    "label": "cc0-protected-dataset-authorship",
    "iconColor": "alright",
    "iconTitle": "cc0-protected-dataset-authorship-comment",
  }),
  [null]: () => ({
    "label": "missing-protected-dataset-authorship",
    "iconColor": "danger",
    "iconTitle": "missing-protected-dataset-authorship-comment",
  }),
}

export function renderHtml(services, languages, query, data, reply) {
  if (data == null) {
    services.http.handleNotFound(services, reply);
    return;
  }
  const templateData = prepareTemplateData(
    services.configuration, services.translation, services.navigation,
    languages, query, data);
  const template = services.template.view(ROUTE.DATASET_DETAIL);
  reply
    .code(200)
    .header("Content-Type", "text/html; charset=utf-8").send(template(templateData));
    // .header("Content-Type", "application/json; charset=utf-8").send({ query, "data": templateData, "source": data });
}

export function prepareTemplateData(configuration, translation, navigation, languages, query, data) {
  return {
    "navigation": components.createNavigationData(navigation, languages, query),
    "footer": components.createFooterData(),
    "dataset": prepareDataset(configuration, translation, navigation, data),
    "distributions": prepareDistributions(configuration, translation, navigation, query, data),
    "applications": prepareApplications(navigation, data),
    "datasetSeries": prepareDatasetSeries(navigation, data),
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
      "href": datasetListNavigation.linkFromServer({ "keyword": [keyword] }),
    })),
    "themesVisible": dataset.themes.length > 0,
    "themes": dataset.themes.map(item => ({
      "iri": item.iri,
      "label": item.label,
      "href": datasetListNavigation.linkFromServer({ "theme": [item.iri] }),
    })),
    "euroVocThemesVisible": dataset.euroVocThemes.length > 0,
    "euroVocThemes": dataset.euroVocThemes.map(item => ({
      "iri": item.iri,
      "label": item.label,
      "href": datasetListNavigation.linkFromServer({ "theme": [item.iri] }),
    })),
    // [Vztahy ze sémantického slovníku]( configuration.semanticVisualisation + encodeURIComponent(dataset.iri))
    // [Pojmy ze sémantického slovníku](datasetSearchUrl = theme) [](configuration.semanticBrowser + encodeURIComponent(iri))
    // "semanticThemesVisible": dataset.semanticThemes.length > 0,
    // "semanticThemes": dataset.semanticThemes, // TODO ? semanticThemes
    "spatialVisible": dataset.spatial.length > 0,
    "spatial": dataset.spatial,
    //
    "spatialResolutionInMetersVisible": dataset.spatialResolutionInMeters !== null,
    "spatialResolutionInMeters": dataset.spatialResolutionInMeters,
    //
    "temporalResolutionVisible": dataset.temporalResolution !== null,
    "temporalResolution": xsdDurationToString(translation, dataset.temporalResolution),
    //
    "temporalVisible": dataset.temporal !== null,
    "temporal": dataset.temporal === null ? null : temporalAsString(dataset.temporal),
    //
    "documentationVisible": dataset.documentation.length > 0,
    "documentation": dataset.documentation,
    //
    "contactVisible": dataset.contactPoints.length > 0,
    "contact": prepareContactPoints(dataset.contactPoints),
    //
    "conformsToVisible": dataset.conformsTo.length > 0,
    "conformsTo": dataset.conformsTo,
    //
    "frequencyVisible": dataset.frequency !== null,
    "frequency": {
      "iri": dataset.frequency?.iri,
      "label": dataset.frequency?.label,
    },
  };
}

function xsdDurationToString(translation, durationAsStr) {
  if (durationAsStr === null) {
    return null;
  }
  const { year, month, day, hour, minute, second, negative } = parseXsdDuration(durationAsStr);
  let result = "";
  let head = true;
  if (negative) {
    result = "-";
    head = false;
  }
  if (year !== null) {
    result += head ? "" : " ";
    result += translation.translate("year", year);
    head = false;
  }
  if (month !== null) {
    result += head ? "" : " ";
    result += translation.translate("month", month);
    head = false;
  }
  if (day !== null) {
    result += head ? "" : " ";
    result += translation.translate("day", day);
    head = false;
  }
  if (hour !== null) {
    result += head ? "" : " ";
    result += translation.translate("hour", hour);
    head = false;
  }
  if (minute !== null) {
    result += head ? "" : " ";
    result += translation.translate("minute", minute);
    head = false;
  }
  if (second !== null) {
    result += head ? "" : " ";
    result += translation.translate("second", second);
    head = false;
  }
  return result;
}

function parseXsdDuration(value) {
  // https://www.w3schools.com/xml/schema_dtypes_date.asp
  const result = {
    "year": null,
    "month": null,
    "day": null,
    "hour": null,
    "minute": null,
    "second": null,
    "negative": value.startsWith("-"),
  };
  // Upper case and remove starting 'P'.
  value = value.toLocaleUpperCase();
  let readingTime = false;
  let buffer = "";
  for (let index = value.indexOf("P") + 1; index < value.length; ++index) {
    const next = value[index];
    if (next === "T") {
      readingTime = true;
    } else if (next === "Y") {
      result.year = parseInt(buffer);
      buffer = "";
    } else if (next === "M") {
      if (readingTime) {
        result.minute = parseInt(buffer);
      } else {
        result.month = parseInt(buffer);
      }
      buffer = "";
    } else if (next === "D") {
      result.day = parseInt(buffer);
      buffer = "";
    } else if (next === "H") {
      result.hour = parseInt(buffer);
      buffer = "";
    } else if (next === "S") {
      result.second = parseInt(buffer);
      buffer = "";
    } else {
      buffer += next;
    }
  }
  return result;
}

function temporalAsString({ iri, startDate, endDate }) {
  if (startDate === null) {
    if (endDate === null) {
      result = iri;
    } else {
      return " - " + removeTimeZone(endDate);
    }
  } else {
    if (endDate === null) {
      return removeTimeZone(startDate) + " - ";
    } else {
      return removeTimeZone(startDate) + " - " + removeTimeZone(endDate);
    }
  }
}

/**
 * Remove time zone, changing YYYY-MM-DD+02:00 to YYYY-MM-DD.
 */
function removeTimeZone(dateAsStr) {
  const plusIndex = dateAsStr.indexOf("+");
  if (plusIndex === -1) {
    return dateAsStr;
  } else {
    return dateAsStr.substr(0, dateAsStr.indexOf("+"));
  }
}

function prepareContactPoints(contactPoints) {
  return contactPoints.map(contactPoint => ({
    "label": contactPoint.title,
    "href": "mailto:" + contactPoint.email,
  }));
}

function prepareDistributions(configuration, translation, navigation, query, data) {
  if (data.distributions.items.length === 0) {
    return {
      "visible": false,
    };
  }
  return {
    "visible": true,
    "pagination": {
      "visible": data.distributions.total > query.distributionPageSize,
      "total": data.distributions.total,
      "pageSize": query.distributionPageSize,
      "currentPage": query.distributionPage + 1,
      "linkTemplate": navigation.linkFromServer({
        ...query,
        "distributionPage": "_PAGE_"
      }).replace("_PAGE_", "{PAGE}") // We need '{PAGE}' in link template.
    },
    "items": data.distributions.items.map(item => ({
      "title": item.title, // title
      "format": item.format?.label ?? null, // format.label
      ...prepareLegal(translation, item),
      ...prepareDistribution(item),
      ...prepareDataService(configuration, item, item.dataService)
    })),
  };
}

function prepareLegal(translation, distribution) {
  const legal = distribution.legal;
  if (legal === null) {
    if (distribution.license === null) {
      return {
        "missingLegal": true,
      };
    } else {
      return {
        "dcatApLegal": {
          "license": distribution.license
        },
      };
    }
  }

  // Information about personal information can be missing.
  const personalData = PERSONAL_DATA_MAP[legal.personalData]?.() ?? null;
  if (personalData !== null) {
    personalData.label = translation.translate(personalData.label);
    personalData.iconTitle = translation.translate(personalData.iconTitle);
  }

  // Authorship can be a custom value.
  const authorship = AUTHORSHIP_MAP[legal.authorship]?.(legal.author) ?? {
    "href": legal.authorship,
    // license.authorCustomComment
  };
  if (authorship !== null) {
    authorship.label = translation.translate(authorship.label);
    authorship.iconTitle = translation.translate(authorship.iconTitle);
  }

  // Database authorship can be a custom value.
  const databaseAuthorship = DATABASE_AUTHORSHIP_MAP[legal.databaseAuthorship]?.(legal.databaseAuthor) ?? {
    "href": legal.databaseAuthorship,
    // "license.authorCustomComment
  };
  if (databaseAuthorship !== null) {
    databaseAuthorship.label = translation.translate(databaseAuthorship.label);
    databaseAuthorship.iconTitle = translation.translate(databaseAuthorship.iconTitle);
  }

  // Protected database authorship can be a custom value.
  const protectedDatabaseAuthorship = PROTECTED_DATABASE_AUTHORSHIP_MAP[legal.protectedDatabase]?.() ?? {
    "href": legal.protectedDatabase,
    //license.specialdbCustom
  };
  if (databaseAuthorship !== null) {
    protectedDatabaseAuthorship.label = translation.translate(protectedDatabaseAuthorship.label);
    protectedDatabaseAuthorship.iconTitle = translation.translate(protectedDatabaseAuthorship.iconTitle);
  }

  return {
    "dcatApCzLegal": {
      // {label} {icon person} {message}
      personalData,
      authorship,
      databaseAuthorship,
      protectedDatabaseAuthorship
    },
  };
}

function prepareDistribution(distribution) {
  if (distribution.type !== "Distribution") {
    return {
      "distribution": null,
    };
  }
  let downloadArray = distribution.downloadURL;
  if (downloadArray === null && distribution.accessURL !== null) {
    downloadArray = [distribution.accessURL];
  }
  let mediaType;
  if (distribution.mediaType !== null) {
    mediaType = {
      "iri": distribution.mediaType.iri,
      "label": distribution.mediaType.label,
    }
  }
  return {
    "distribution": {
      "downloadArray": downloadArray,
      // QUALITY.download, verified_user / link_off
      // QUALITY.downloadCors, http / http
      "schemaArray": distribution.conformsTo,
      // QUALITY.schema, verified_user / link_off
      // QUALITY.schemaCors, http / http
      "mediaType": mediaType,
      // QUALITY.mediaType, verified_user / link_off
      "compressFormat": distribution.compressFormat,
      "packageFormat": distribution.packageFormat,
    },
  };
}

function prepareDataService(configuration, distribution, dataService) {
  if (distribution.type !== "DataService" && dataService !== null) {
    return {
      "dataService": null,
    };
  }
  let mediaType;
  if (distribution.mediaType !== null) {
    mediaType = {
      "iri": distribution.mediaType.iri,
      "label": distribution.mediaType.label,
    }
  }
  const client = configuration.client;
  const sparqlCompliant = dataService.conformsTo?.includes(SPARQL_SCHEMA);
  const showSparqlEditor = sparqlCompliant && dataService.endpointURL && client.sparqlEditorUrl;
  return {
    "dataService": {
      "endpointDescription": dataService.endpointDescription,
      // QUALITY.endpointDescription, verified_user / link_off
      // QUALITY.endpointDescriptionCors, http / http
      "endpointURL": dataService.endpointURL, // endpointURL
      // QUALITY.endpointUrl, verified_user / link_off
      // QUALITY.endpointUrlCors, http / http
      "sparqlEditor": showSparqlEditor
        ? `${client.sparqlEditorUrl}#query=${client.sparqlDefaultQuery}&endpoint=${dataService.endpointURL}`
        : null,
      "classesAndProperties": showSparqlEditor && client.sparqlClassAndPropertiesTemplate
        ? client.sparqlClassAndPropertiesTemplate.replace("{}", encodeURIComponent(dataService.endpointURL))
        : null,
      "schemaArray": dataService.conformsTo, // conformsTo
      // QUALITY.schema, verified_user / link_off
      "mediaType": mediaType,
      // QUALITY.mediaType, verified_user / link_off
      "compressFormat": distribution.compressFormat,
      "packageFormat": distribution.packageFormat,
    },
  };
}


function prepareApplications(navigation, { applications }) {
  const applicationDetailNavigation = navigation.changeView(ROUTE.APPLICATION_DETAIL);
  return {
    "visible": applications.length > 0,
    "items": applications.map(application => ({
      "title": application.title,
      "description": application.description,
      "href": applicationDetailNavigation.linkFromServer({ "iri": application.iri }),
    })),
  };
}

function prepareDatasetSeries(navigation, { dataset, series }) {
  const datasetDetailNavigation = navigation.changeView(ROUTE.DATASET_DETAIL);
  const datasetListNavigation = navigation.changeView(ROUTE.DATASET_LIST);
  return {
    "visible": series.total > 0,
    "total": series.total,
    "items": series.items.map(dataset => ({
      "title": dataset.title,
      "description": dataset.description,
      "href": datasetDetailNavigation.linkFromServer({ "iri": dataset.iri }),
    })),
    "showAllHref": datasetListNavigation.linkFromServer({
      "isPartOf": dataset.iri,
    })
  };
}
