/**
 * Create translation service from pairs or server local strings.
 */
export function createTranslationService(serverToLocal) {
  return {
    /**
     * @param {string} serverMessage
     * @param {number | undefined} number
     */
    "translate": (serverMessage, number) =>
      translate(serverToLocal, serverMessage, number),
  };
}

function translate(serverToLocal, serverMessage, number) {
  let result;
  const entry = serverToLocal[serverMessage];
  if (Array.isArray(entry)) {
    // Initial value.
    result = entry[0][1];
    for (let [separator, localizedMessage] of entry) {
      if (separator > number) {
        break;
      }
      result = localizedMessage;
    }
  } else {
    result = entry;
  }
  return result.replace("{}", number);
}
