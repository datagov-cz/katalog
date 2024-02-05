import { getString } from "./jsonld.mjs";

/**
 * Return object {language: string}.
 */
export function parseLabelResponse(languages, response, predicate) {
  // 'languages' as not used as we get all the data anyway
  if (response["error"] !== undefined) {
    return null;
  }
  const jsonld = response["jsonld"];
  if (jsonld === undefined) {
    return {};
  }
  const resource = jsonld[0];
  if (resource === undefined) {
    return {};
  }
  return getString(resource, predicate);
}

export function selectForLanguages(languages, values) {
  for (const language of languages) {
    if (values[language] === undefined) {
      continue;
    }
    return [language, values[language]];
  }
  const key = Object.keys(values)[0];
  return [key, values[key]];
}
