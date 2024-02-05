import configuration from "../configuration.mjs";

export function registerFooter(templateService, language) {
  templateService.syncAddComponent("footer", "footer-" + language + ".html");
}

export function createFooterData() {
  return {
    "registrationFormUrl": configuration.client.applicationFormUrl
  };
}
