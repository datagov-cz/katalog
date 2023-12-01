import * as querystring from "node:querystring";

/**
 * Takes localization for given view and serverQuery.
 */
const NOOP = (localization, serverQuery) => serverQuery;

/**
 * Input object must contain value relevant for given language only.
 */
export function createLocalization(serverToClient, language) {
  const localization = {
    // Current language.
    "language": language,
  };

  // Create binding for a particular view.
  localization["view"] = (viewName, beforeLink = NOOP) => createView({
    "path": serverToClient["path"],
    "query": serverToClient["query"][viewName] ?? {},
    "argument": serverToClient["arguments"][viewName] ?? {},
    "translation": serverToClient["translation"],
  }, localization, viewName, beforeLink);

  return localization;
}

function createView(
  { query, argument, path, translation }, parent, viewName, beforeLink) {
  const result = {
    // Parent localization.
    "parent": parent,
    // Language.
    "language": parent.language,
    // Load argument from client as a value or null.
    "queryArgumentFromClient": (clientQuery, serverKey) =>
      queryArgumentFromClient(query, clientQuery, serverKey),
    // Load argument from client as an array.
    "queryArgumentArrayFromClient": (clientQuery, serverKey) =>
      queryArgumentArrayFromClient(query, clientQuery, serverKey),
    // Translate argument from server.
    "argumentFromServer": (serverKey) => argument[serverKey],
    // Translate text for user-interface.
    "translateFromServer": (serverMessage, number) =>
      translateFromServer(translation, serverMessage, number),
  };
  // Create link from server.
  result["linkFromServer"] = (serverQuery) =>
    linkFromServer(query, path, argument, viewName,
      beforeLink(result, serverQuery));
  return result;
}

function queryArgumentFromClient(serverToClient, query, key) {
  const clientKey = serverToClient[key];
  const value = query[clientKey];
  return value ?? null;
}

function queryArgumentArrayFromClient(serverToClient, query, key) {
  return asArray(queryArgumentFromClient(serverToClient, query, key, null));
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

function linkFromServer(query, path, argument, viewName, serverQuery) {
  const queryString = queryFromServer(query, serverQuery);
  const clientPath = path[viewName];
  if (queryString === "") {
    return clientPath;
  } else {
    return clientPath + "?" + queryString;
  }
}

function queryFromServer(serverToClient, query) {
  const localized = {};
  for (const [key, value] of Object.entries(query)) {
    if (isEmpty(value)) {
      continue;
    }
    localized[serverToClient[key]] = value;
  }
  return querystring.stringify(localized);
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

function translateFromServer(translation, serverMessage, number) {
  let result;
  let entry = translation[serverMessage];
  if (Array.isArray(entry)) {
    // Initial value.
    result = entry[0][1];
    for (let [separator, localizedMessage] of entry) {
      if (separator > number) {
        break;
      }
      result = localizedMessage;
    }
  } else {
    result = entry;
  }
  return result.replace("{}", number);
}
