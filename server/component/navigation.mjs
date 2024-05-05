
export function registerNavigation(templateService, language) {
  templateService.syncAddComponent("navigation", "navigation-" + language + ".html");
}

export function createNavigationData(
  navigationService, languages, query, options
) {
  // Create links for all languages.
  const result = {};
  for (const language of languages) {
    result[language] = navigationService.changeLanguage(language).linkFromServer(query);
  }
  return {
    //
    datasetsActive: false,
    applicationsActive: false,
    localCatalogsActive: false,
    suggestionsActive: false,
    publishersActive: false,
    //
    ...options,
    ...result
  };
}
