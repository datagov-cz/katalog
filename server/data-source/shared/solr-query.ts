/**
 * Given field and values produce array of pairs {field}:"{value}".
 */
export function prepareFieldQuery(
  fieldName: string,
  values: undefined | null | string[],
): string[] {
  return (values ?? []).map((value) => `${fieldName}:"${value}"`);
}

/**
 * Prepare text query for Solr core. Ask for title_{language} and _text_.
 * When empty value is given return *:* as query for anything.
 */
export function prepareTextQuery(language: string, text: string): string {
  if (text === undefined || text === null || text.length === 0) {
    return "*:*";
  }
  const escapedText = escapeSolrTextQuery(text);
  const tokens = splitStringByWhitespace(escapedText);
  if (tokens.length === 0) {
    return "";
  }
  // We ask for title first to prioritize it before _text_.
  // As a result items with value in title are returned first.
  return (
    "" +
    "( " +
    createFieldQuery("title_" + language + "_query", tokens) +
    " )" +
    " OR " +
    "( " +
    createFieldQuery("_text_", tokens) +
    " )"
  );
}

const SOLR_TEXT_TO_ESCAPE = /([!*+=<>&|{}^~?[\]:"])/g;

/**
 * @returns Text with escaped control sequences.
 */
function escapeSolrTextQuery(query: string): string {
  query = query.toLocaleLowerCase();
  query = query.replace(SOLR_TEXT_TO_ESCAPE, "\\$1");
  // Escape control words: "and", "or", "not".
  query = query.replace("and", "\\and");
  query = query.replace("or", "\\or");
  query = query.replace("not", "\\not");
  return query;
}

function splitStringByWhitespace(text: string): string[] {
  return text
    .trim()
    .split(" ")
    .filter((item) => item !== "")
    .filter(isSpecialCharacter);
}

function isSpecialCharacter(value: string): boolean {
  return value[0] !== "\\" || value.length !== 2;
}

/**
 * Given list of tokens/words and field name creates string as:
 * {field}:{value} AND {field}:{value} AND ...
 *
 * Used in Solr query this searches for items that contain all tokens.
 */
function createFieldQuery(fieldName: string, tokens: string[]): string {
  let result = fieldName + ":*" + tokens[0] + "*";
  for (let index = 1; index < tokens.length; ++index) {
    result += " AND " + fieldName + ":*" + tokens[index] + "*";
  }
  return result;
}

export function prepareSort(
  language: string,
  sort: string | undefined | null,
  sortDirection: string,
): string {
  if (sort === null || sort === undefined) {
    return "";
  }
  // Special handling of 'title', where we sort using different
  // attributes based on the language.
  if (sort === "title") {
    return "title_" + language + "_sort " + (sortDirection ?? "");
  }
  return sort + " " + (sortDirection ?? "");
}
