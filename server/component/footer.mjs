import configuration from "../configuration";

export function registerFooter(templateService, language) {
  templateService.syncAddComponent("footer", "footer-" + language + ".html");
}

export function createFooterData() {
  return {
    applicationRegistrationFormUrl: configuration.client.applicationFormUrl,
    suggestionRegistrationFormUrl: configuration.client.suggestionFormUrl,
    catalogValidator: configuration.client.catalogValidator,
  };
}
