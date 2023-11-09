// https://github.com/pinojs/pino
import pino from "pino";

import configuration from "./configuration.mjs";

const pinoConfiguration = {};

if (configuration.development) {
  // Add pretty print for development.
  pinoConfiguration["transport"] = {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  };
}

const logger = pino(pinoConfiguration);
export default logger;
