import cron from "node-cron";
import { NavigationEntry } from "../service/navigation-service.ts";

const HEADER = {
  cs: "",
  en: "",
};

export async function initializeHeader(baseUrl: string): Promise<void> {
  await updateHeader(baseUrl);
  cron.schedule("*/5 * * * *", () => updateHeader(baseUrl));
}

async function updateHeader(baseUrl: string): Promise<void> {
  HEADER.cs = await (await fetch(baseUrl + "header.cs.html")).text();
  HEADER.en = await (await fetch(baseUrl + "header.en.html")).text();
}

export function headerHtml(navigation, language: "cs" | "en", query) {
  const template = HEADER[language];
  return injectLanguageSelector(template, navigation, language, query);
}

function injectLanguageSelector(
  template: string, navigation: NavigationEntry, language: "cs" | "en",
  query: Record<string, string | number | string[]>,
) {
  // We need to render for the other language not the current one.
  const otherLanguage = language === "cs" ? "en" : "cs";
  const label = otherLanguage === "cs" ? "Čeština" : "English";
  const url = navigation.changeLanguage(otherLanguage).linkFromServer(query);
  const selector = `<div class="language"><a href="${url}">${label}</a></div>`;
  return template.replace(LANGUAGE_PLACEHOLDER, selector);
}

const LANGUAGE_PLACEHOLDER = "<!--PLACEHOLDER_LANGUAGE_SWITCH-->"
