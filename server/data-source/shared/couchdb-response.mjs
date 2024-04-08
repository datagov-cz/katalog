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
 * @param {string[] | null | undefined} languages 
 * @param {object} values With {language: string}.
 * @returns {string | null} Null only for null and undefined.
 */
export function selectForLanguages(languages, values) {
  if (values === null | values === undefined) {
    return null;
  }
  for (const language of languages) {
    if (values[language] === undefined) {
      continue;
    }
    return values[language];
  }
  return Object.values(values)[0] ?? null;
}
