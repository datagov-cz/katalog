import * as querystring from "node:querystring";

import cs from "../templates/cs/localization.mjs";
import en from "../templates/en/localization.mjs";

const internalQueryToLocalized = {
  "cs": cs["query"],
  "en": en["query"],
};

const internalPathToLocalized = {
  "cs": cs["path"],
  "en": en["path"],
};

const translation = {
  "cs": cs["translation"],
  "en": en["translation"],
};

const internalArgumentsToLocalized = {
  "cs": cs["arguments"],
  "en": en["arguments"],
}

export function listLanguages() {
  return Object.keys(internalQueryToLocalized);
}

export function getQueryArgument(
  viewName, language, argumentName, query, defaultValue
) {
  const localizedKey = internalQueryToLocalized[language][viewName][argumentName];
  const value = query[localizedKey];
  return value ?? defaultValue;
}

export function getQueryArgumentAsArray(
  viewName, language, argumentName, query
) {
  return asArray(getQueryArgument(
    viewName, language, argumentName, query, null));
}

function asArray(value) {
  if (value === undefined || value === null) {
    return [];
  } else if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

export function createLink(viewName, language, query) {
  const localized = localizeUrlQuery(viewName, language, query);
  const path = internalPathToLocalized[language][viewName];
  const queryAsString = querystring.stringify(localized);
  if (queryAsString === "") {
    return path;
  } else {
    return path + "?" + queryAsString;
  }  
}

export function localizeUrlQuery(viewName, language, query) {
  const mapping = internalQueryToLocalized[language][viewName];
  return Object.fromEntries(
    Object.entries(query)
      // Filter empty.
      .filter(([key, value]) => !isEmpty(value))
      // Apply mapping.
      .map(([key, value]) => [mapping[key], value])
  );
}

function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "";
  }
}

/**
 * Create and return localized URL for each language.
 */
export function createNavigationData(viewName, query) {
  return Object.fromEntries(Object.keys(internalQueryToLocalized)
    .map(language => [language, createLink(viewName, language, query)]));
}

export function translate(language, message, args) {
  let result;
  let translationEntry = translation[language][message];
  if (Array.isArray(translationEntry)) {
    for (let [separator, localizedMessage] of translationEntry) {
      if (separator >= args) {
        break;
      } else {
        result = localizedMessage;
      }
    }
  } else {
    result = translationEntry;
  }
  return result.replace("{}", args);
}

export function translateArgument(viewName, language, value) {
  return internalArgumentsToLocalized[language][viewName][value];
}
