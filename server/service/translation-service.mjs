/**
 * Create translation service from pairs or server local strings.
 */
export function createTranslationService(serverToLocal) {
  return {
    /**
     * @param {string} serverMessage
     * @param {number | object | undefined} args
     */
    "translate": (serverMessage, args) =>
      translate(serverToLocal, serverMessage, args),
  };
}

function translate(serverToLocal, serverMessage, args) {
  let result;
  const entry = serverToLocal[serverMessage];
  // When given a function we do not care about anything else.
  if (entry instanceof Function) {
    return entry(args);
  }
  // We allow for simple "{}" substitution.
  if (Array.isArray(entry)) {
    // Initial value.
    result = entry[0][1];
    for (let [separator, localizedMessage] of entry) {
      if (separator > args) {
        break;
      }
      result = localizedMessage;
    }
  } else {
    result = entry;
    if (result === undefined) {
      console.error("Missing localization entry.", {serverMessage});
      result = "";
    }
  }
  return result.replace("{}", args);
}
