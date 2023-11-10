import Handlebars from "handlebars";
import fileSystem from "fs";

import logger from "../logger.mjs";
import configuration from "../configuration.mjs";

const templatesCache = {};

export function initializeTemplates() {
  const handlebars = Handlebars.create();
  registerHelpers(handlebars);  
  templatesCache["cs"] = loadTemplates(handlebars, "./templates/cs/");
}

function registerHelpers(handlebars) {
  handlebars.registerHelper("breaklines", (value) => {
    const escapedText = Handlebars.Utils.escapeExpression(value);
    const result = escapedText.replace(/(\r\n|\n|\r)/gm, "<br>");
    return new Handlebars.SafeString(result);
  });  
}

function loadTemplates(handlebars, directory) {
  logger.info("Loading templates ...");

  const result = {};

  const listString = fileSystem.readFileSync(directory + "application-list.html", "utf8");
  result["application-list"] = handlebars.compile(listString);

  const detailString = fileSystem.readFileSync(directory + "application-detail.html", "utf8");
  result["application-detail"] = handlebars.compile(detailString);

  // This item is shared by multiple languages.
  const headString = fileSystem.readFileSync(directory + "../head.html", "utf8");
  handlebars.partials["head"] = handlebars.compile(headString);

  const navigationString = fileSystem.readFileSync(directory + "navigation.html", "utf8");
  handlebars.partials["navigation"] = handlebars.compile(navigationString);

  const footerString = fileSystem.readFileSync(directory + "footer.html", "utf8");
  handlebars.partials["footer"] = handlebars.compile(footerString);

  logger.info("Loading templates ... done");

  return result;
}

export function getTemplatesForLanguage(language) {
  // Reload templates in debug mode.
  if (configuration.reloadTemplates) {
    initializeTemplates();
  }
  return templatesCache[language];
}
