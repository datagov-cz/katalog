// Load values from .env file and put them into process.env.
import "dotenv/config";

const configuration = {
  port: process.env["PORT"],
  host: process.env["HOST"],
  // https://fastify.dev/docs/latest/Reference/Server/#trustproxy
  trustProxy: false,
  solrUrl: stripTrailingSlash(process.env["SOLR_URL"]),
  couchDbUrl: stripTrailingSlash(process.env["COUCHDB_URL"]),
  development: process.env.NODE_ENV === "development",
  serverAssets: process.env.NODE_ENV === "development" || process.env.HTTP_SERVE_STATIC === "1",
  reloadTemplates: process.env.NODE_ENV === "development",
};

console.log("Configuration: ", JSON.stringify(configuration, null, 2));

function stripTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

export default configuration;
