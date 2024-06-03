import {registerFacet} from "./facet.mjs";
import {registerFooter} from "./footer.mjs";
import {registerHead} from "./head.mjs";
import {registerNavigation} from "./navigation.mjs";
import {registerPagination} from "./pagination.mjs";
import {registerResultBar} from "./result-bar.mjs";

export {createFacetData} from "./facet.mjs";
export {createFooterData} from "./footer.mjs";
export {createNavigationData} from "./navigation.mjs";
export {createPaginationData} from "./pagination.mjs";
export {createResultBarData} from "./result-bar.mjs";

export function registerComponents(templateService, language) {
  registerFacet(templateService, language)
  registerFooter(templateService, language);
  registerHead(templateService, language);
  registerNavigation(templateService, language);
  registerPagination(templateService, language);
  registerResultBar(templateService, language);
}
