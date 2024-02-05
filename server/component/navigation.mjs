
export function registerNavigation(templateService, language) {
  templateService.syncAddComponent("navigation", "navigation-" + language + ".html");
}

export function createNavigationData(
  navigationService, languages, query, links
) {
  const applicationsActive = links?.applications ?? false;
  const suggestionsActive = links?.suggestions ?? false;

  // Create links for all languages.
  const result = {};
  for (const language of languages) {
    result[language] = navigationService.changeLanguage(language).linkFromServer(query);
  }
  return {
    applicationsActive,
    suggestionsActive,
    ...result
  };
}
