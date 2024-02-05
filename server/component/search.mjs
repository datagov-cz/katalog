
export function registerSearch(templateService, language) {
  templateService.syncAddComponent(
    "search", "search-" + language + ".html");
}

export function createSearchData(navigationService, translationService, query) {
  return {
    "value": query["query"] ?? "",
    "query-name": translationService.translate("input-name-query"),
    "url": navigationService.linkFromServer({
      ...query,
      "page": 0,
      "query": ""
    })
  };
}
