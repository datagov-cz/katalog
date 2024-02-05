/**
 * Return undefined or object with language:value pairs.
 */
export function getString(entity, predicate) {
  const strings = getStrings(entity, predicate);
  if (strings.length === 0) {
    return undefined;
  }
  let result = {}
  strings.forEach((string) => {
    result = { ...result, ...string };
  });
  return result;
}

export function getStrings(entity, predicate) {
  return asArray(entity[predicate]).map(valueToString);
}

function asArray(value) {
  if (value === undefined || value === null) {
    return [];
  } else if (Array.isArray(value)) {
    return value;
  } else {
    return [value];
  }
}

function valueToString(value) {
  if (value["@value"] === undefined) {
    // This is a primitive value.
    return { "": value };
  }
  if (value["@language"]) {
    // There is language.
    return { [value["@language"]]: value["@value"] };
  }
  // There is no language.
  return { "": value["@value"] };
}
