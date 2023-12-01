import {createLocalization} from "./localization.mjs";

import cs from "../templates/cs/localization.mjs";
import en from "../templates/en/localization.mjs";

const localizations = {
  "cs": createLocalization(cs, "cs"),
  "en": createLocalization(en, "en"),
 };

export function listLanguages() {
  return Object.keys(localizations);
}

export function getLocalization(language) {
  return localizations[language];
}
