// Load values from .env file and put them into process.env.
import "dotenv/config";

const configuration = {
  port: process.env.PORT,
  host: process.env.HOST,
  // https://fastify.dev/docs/latest/Reference/Server/#trustproxy
  trustProxy: false,
  solrUrl: stripTrailingSlash(process.env.SOLR_URL),
  couchDbUrl: stripTrailingSlash(process.env.COUCHDB_URL),
  datasetCatalogLink: stripTrailingSlash(process.env.DATASET_CATALOG_URL),
  development: process.env.NODE_ENV === "development",
  serverAssets: process.env.NODE_ENV === "development" || process.env.HTTP_SERVE_STATIC === "1",
  reloadTemplates: process.env.NODE_ENV === "development",
  labelReloadCron: process.env.LABEL_CACHE_RELOAD_CRON,
  client: { // Used for rendering.
    applicationFormUrl: process.env.CLIENT_APPLICATION_FORM_URL ?? "",
    suggestionFormUrl: process.env.CLIENT_SUGGESTION_FORM_URL ?? "",
  },
};

console.log("{\"configuration\": " + JSON.stringify(configuration) + "}");

function stripTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export default configuration;
