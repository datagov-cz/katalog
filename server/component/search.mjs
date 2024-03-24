
export function registerSearch(templateService, language) {
  templateService.syncAddComponent(
    "search", "search-" + language + ".html");
}

// translationService, navigationService, query, sortOptions, itemsCount
export function createSearchData(navigationService, translationService, query, sortOptions) {
  return {
    // TODO We need to use this in header.
    // "value": query["query"] ?? "",
    // "query-name": translationService.translate("input-name-query"),
    // "url": navigationService.linkFromServer({
    //   ...query,
    //   "page": 0,
    //   "query": ""
    // }),
  };
}
