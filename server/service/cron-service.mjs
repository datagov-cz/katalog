import cron from "node-cron";

import logger from "../logger.mjs";

export function createCronService(configuration, labelService) {
  return {
    /**
     * Setup all time-based actions.
     */
    "initialize": () => initialize(configuration, labelService),
  };
}

function initialize(configuration, labelService) {
  if (isNotEmpty(configuration.labelReloadCron)) {
    logger.info("Cache reload registered.")
    cron.schedule(configuration.labelReloadCron, () => {
      labelService.reloadCache();
    });
  }
}

function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}
