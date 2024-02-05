export function selectForLanguages(languages, values) {
  for (const language of languages) {
    if (values[language] === undefined) {
      continue;
    }
    return values[language];
  }
  return Object.values(values)[0] ?? null;
}
