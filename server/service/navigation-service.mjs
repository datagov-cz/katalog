import * as querystring from "node:querystring";

/**
 * Given navigation and server query, this callback can modify content of the
 * query before we create a link.
 */
const NOOP = (_, serverQuery) => serverQuery;

export function createNavigationService() {
  return new NavigationService();
}

class NavigationService {

  constructor() {
    this.beforeLinks = {};
    this.data = {};
  }

  /**
   * Return navigation for given view.
   * @param {String} language
   * @param {String} viewName
   * @returns {ViewBoundNavigation}
   */
  view(language, viewName) {
    const key = language + ":" + viewName;
    if (this.data[key] === undefined) {
      this.data[key] = {
        "path": "",
        "query": {},
        "argument": {},
        "beforeLink": NOOP,
      };
    }
    return new ViewBoundNavigation(this, language, viewName, this.data[key]);
  }

}

class ViewBoundNavigation {

  constructor(parent, language, viewName, data) {
    this.parent = parent;
    this.language = language;
    this.viewName = viewName;
    this.data = data;
  }

  setNavigationData(serverToLocal) {
    this.data.path = serverToLocal.path;
    this.data.query = serverToLocal.query ?? {};
    this.data.argument = serverToLocal.argument ?? {};
    return this;
  }

  setBeforeLink(callback) {
    this.data.beforeLink = callback;
    return this;
  }

  changeLanguage(language) {
    return this.parent.view(language, this.viewName);
  }

  changeView(viewName) {
    return this.parent.view(this.language, viewName);
  }

  /**
   * Return array value from query for given key.
   */
  queryArgumentArrayFromClient(clientQuery, serverKey) {
    const clientKey = this.data.query[serverKey];
    const value = clientQuery[clientKey] ?? null;
    if (Array.isArray(value)) {
      return value;
    }
    return asArray(value);
  }

  /**
   * Return value from query for given key.
   */
  queryArgumentFromClient(clientQuery, serverKey) {
    const clientKey = this.data.query[serverKey];
    const value = clientQuery[clientKey] ?? null;
    if (Array.isArray(value)) {
      return clientQuery[0];
    }
    return value;
  }

  /**
   * Return local argument for server key.
   */
  argumentFromServer(serverKey) {
    return this.data.argument[serverKey] ?? null;
  }

  /**
   * Return relative link to this view with given query.
   */
  linkFromServer(query) {
    const effectiveQuery =  this.data.beforeLink(this, query);
    const queryString = this.queryFromServer(effectiveQuery);
    const clientPath = this.data.path;
    if (queryString === "") {
      return clientPath;
    } else {
      return clientPath + "?" + queryString;
    }
  }

  /**
   * Translate URL query into encoded string.
   * @param {Object} query Server query object.
   * @returns {String}
   */
  queryFromServer(query) {
    const localized = {};
    for (const [key, value] of Object.entries(query)) {
      if (isEmpty(value)) {
        continue;
      }
      let queryName = this.data.query[key];
      if (Array.isArray(queryName)) {
        queryName = queryName[0];
      }
      localized[queryName] = value;
    }
    return querystring.stringify(localized);
  }

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

function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === "";
  }
}
