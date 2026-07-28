import { HandlebarsService } from "../../handlebars/index.ts";
import { Language } from "../../localization/index.ts";

export function registerQuerySection(
  handlebars: HandlebarsService, language: Language
) {
  handlebars.syncAddComponent(
    "query-section",
    "query-section/query-section-" + language + ".html");
}

const translations: { [language: string]: Record<string, string> } = {
  "cs": {
    "publishers": "Poskytovatelé",
    "datasetTypes": "Druh datové sady",
    "themes": "Témata",
    "hvdCategories": "Kategorie HVD",
    "dataServiceTypes": "Datová služba",
    "formats": "Formáty",
    "keywords": "Klíčová slova",
    "isvs": "Informační systém veřejné správy",
  },
  "en": {
    "publishers": "Publishers",
    "datasetTypes": "Dataset kind",
    "themes": "Themes",
    "hvdCategories": "HVD category",
    "dataServiceType": "Data service",
    "formats": "Formats",
    "keywords": "Keywords",
    "isvs": "Public administration information system",
  }
}

export function prepareStateForHandlebars(
  state: QuerySectionState,
  language: Language,
): QuerySectionHandlebarsState {
  const items: { label: string; items: Action[]; }[] = [];

  if (state.publishers.length > 0) {
    items.push({
      label: translations[language].publishers,
      items: state.publishers
    });
  }

  if (state.datasetTypes.length > 0) {
    items.push({
      label: translations[language].datasetTypes,
      items: state.datasetTypes
    });
  }

  if (state.themes.length > 0) {
    items.push({
      label: translations[language].themes,
      items: state.themes
    });
  }

  if (state.hvdCategories.length > 0) {
    items.push({
      label: translations[language].hvdCategories,
      items: state.hvdCategories
    });
  }

  if (state.dataServiceTypes.length > 0) {
    items.push({
      label: translations[language].dataServiceTypes,
      items: state.dataServiceTypes
    });
  }

  if (state.formats.length > 0) {
    items.push({
      label: translations[language].formats,
      items: state.formats
    });
  }

  if (state.keywords.length > 0) {
    items.push({
      label: translations[language].keywords,
      items: state.keywords
    });
  }

  if (state.isvs.length > 0) {
    items.push({
      label: translations[language].isvs,
      items: state.isvs
    });
  }

  return {
    showTemporal: state.temporalStart !== null || state.temporalEnd !== null,
    temporalStart: state.temporalStart,
    temporalEnd: state.temporalEnd,
    items,
  }
}

export interface QuerySectionState {

  temporalStart: Action | null;

  temporalEnd: Action | null;

  publishers: Action[];

  datasetTypes: Action[];

  themes: Action[];

  hvdCategories: Action[];

  dataServiceTypes: Action[];

  formats: Action[];

  keywords: Action[];

  isvs: Action[];

}

interface Action {

  /**
   * Label to display.
   */
  label: string;

  /**
   * URL to navigate to cancel the filter.
   */
  href: string;

}

interface QuerySectionHandlebarsState {

  showTemporal: boolean;

  temporalStart: Action | null;

  temporalEnd: Action | null;

  items: {

    label: string;

    items: Action[];

  }[];

}

