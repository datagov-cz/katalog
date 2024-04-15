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
  designSystemFolder: stripTrailingSlash(process.env.DESIGN_SYSTEM_FOLDER),
  client: { // Used for rendering.
    catalogFormUrl: process.env.CLIENT_CATALOG_FORM_URL ?? "",
    applicationFormUrl: process.env.CLIENT_APPLICATION_FORM_URL ?? "",
    suggestionFormUrl: process.env.CLIENT_SUGGESTION_FORM_URL ?? "",
    // Replace {} with publisher URL.
    publisherDashboardDailyTemplate: process.env.CLIENT_DASHBOARD_PUBLISHER_DAILY ?? "",
    // Replace {} with publisher URL.
    publisherDashboardMonthlyTemplate: process.env.CLIENT_DASHBOARD_PUBLISHER_MONTHLY ?? "",
    // Replace {} with URL for reference.
    dereferenceTemplate: process.env.CLIENT_DEREFERENCE ?? "",
    //
    sparqlEditorUrl: process.env.CLIENT_SPARQL_EDITOR_URL ?? null,
    sparqlDefaultQuery: process.env.CLIENT_SPARQL_DEFAULT_QUERY ?? null,
    // Replace {} with endpoint URL.
    sparqlClassAndPropertiesTemplate: process.env.CLIENT_DATA_SERVICE_CLASS_AND_PROPERTIES_TEMPLATE ?? null
  },
};

console.log("{\"configuration\": " + JSON.stringify(configuration) + "}");

function stripTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export default configuration;
