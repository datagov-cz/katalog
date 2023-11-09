/**
 * Given field and values produce array of pairs {field}:"{value}".
 */
export function prepareFieldQuery(field, values) {
  return values.map(value => `${field}:"${value}"`);
}

function isEmpty(value) {
  return value === undefined || value === null || value.length === 0;
}

/**
 * Prepare text query for Solr core. Ask for title_{language} and _text_.
 * When empty value is given return *:* as query for anything.
 */
export function prepareSolrTextQuery(language, text) {
  if (isEmpty(text)) {
    return "*:*";
  }

  const escapedText = escapeSolrTextQuery(text);

  const tokens = splitString(escapedText);
  if (tokens.length === 0) {
    return "";
  }

  // We ask for title first to prioritize it before _text_.
  // As a result items with value in title are returned first.
  return "" +
    "( " + createFieldQuery("title_" + language + "_query", tokens) + " )" +
    " OR " +
    "( " + createFieldQuery("_text_", tokens) + " )";
}

/**
 * Escape control sequences for Solr text query.
 */
function escapeSolrTextQuery(text) {
  if (isEmpty(text)) {
    return "*:*";
  }

  text = text.toLocaleLowerCase();

  const charactersToEscape = /([!*+=<>&|{}^~?[\]:"])/g;
  text = text.replace(charactersToEscape, "\\$1");

  // Escape control words: "and", "or", "not".
  text = text.replace("and", "\\and");
  text = text.replace("or", "\\or");
  text = text.replace("not", "\\not");
  return text;
}

/**
 * Split string using space.
 */
function splitString(text) {
  return text.trim().split(" ")
    .filter(item => !isEmpty(item))
    .filter(isSpecialCharacter);
}

function isSpecialCharacter(value) {
  return value[0] !== "\\" || value.length !== 2;
}

/**
 * Given list of tokens/words and field name creates string as:
 * {field}:{value} AND {field}:{value} AND ...
 * 
 * Used in Solr query this searches for items that contain all tokens.
 */
function createFieldQuery(fieldName, tokens) {
  let result = fieldName + ":*" + tokens[0] + "*";
  for (let index = 1; index < tokens.length; ++index) {
    result += " AND " + fieldName + ":*" + tokens[index] + "*";
  }
  return result;
}
