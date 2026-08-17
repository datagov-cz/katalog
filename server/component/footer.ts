import cron from "node-cron";

const FOOTER = {
  cs: "",
  en: "",
};

export async function initializeFooter(baseUrl: string): Promise<void> {
  await updateFooter(baseUrl);
  cron.schedule("*/5 * * * *", () => updateFooter(baseUrl));
}

async function updateFooter(baseUrl: string): Promise<void> {
  FOOTER.cs = await (await fetch(baseUrl + "footer.cs.html")).text();
  FOOTER.en = await (await fetch(baseUrl + "footer.en.html")).text();
}

export function footerHtml(language: "cs" | "en") {
  return FOOTER[language];
}
