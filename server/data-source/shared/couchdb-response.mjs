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

/**
 * @param {string[]} languages 
 * @param {object} values With {language: string}.
 * @returns {string}
 */
export function selectForLanguages(languages, values) {
  for (const language of languages) {
    if (values[language] === undefined) {
      continue;
    }
    return values[language];
  }
  return Object.values(values)[0];
}
