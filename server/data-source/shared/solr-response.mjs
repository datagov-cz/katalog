import logger from "../../logger.mjs";

export function selectLanguage(document, name_prefix, languages) {
  for (const language of languages) {
    const key = name_prefix + language;
    const value = document[key];
    if (isEmpty(value)) {
      continue;
    }
    return value;
  }
  return null;
}

export function emptyAsNull(value) {
  if (isEmpty(value)) {
    return null;
  } else {
    return value;
  }
}

function isEmpty(value) {
  return value === undefined || value === null || value.trim() === "";
}

export function parseFacet(payload) {
  if (payload == undefined) {
    return [];
  }
  const result = [];
  for (let index = 0; index < payload.length; index += 2) {
    result.push({
      "iri": payload[index],
      "count": payload[index + 1],
    });
  }
  result.sort((left, right) => right.count - left.count);
  return result;
}

export function parseDate(value) {
  if (value == undefined) {
    return null;
  }
  const result = new Date(value);
  if (isNaN(result.getDate())) {
    logger.info("Invalid date '%s'.", value);
    return null;
  }
  return result;
}
