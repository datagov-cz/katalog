import cron from "node-cron";

const HEADER = {
  cs: "",
  en: "",
};

export async function initializeHeader(baseUrl: string): Promise<void> {
  await updateHeader(baseUrl);
  cron.schedule("*/5 * * * *", () => updateHeader(baseUrl));
}

async function updateHeader(baseUrl: string) : Promise<void> {
  HEADER.cs = await (await fetch(baseUrl + "header.cs.html")).text();
  HEADER.en = await (await fetch(baseUrl + "header.en.html")).text();
}

export function headerHtml(language: "cs" | "en") {
  return HEADER[language];
}
