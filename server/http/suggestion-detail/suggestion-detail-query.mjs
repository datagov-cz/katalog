export function parseClientQuery(navigation, query) {
  return {
    iri: navigation.queryArgumentFromClient(query, "iri"),
  };
}
