import { Configuration } from "../configuration.ts";

export interface HeadData {

  matomoIsActive: boolean;

  matomoUrl: string | null;

  matomoSiteId: string | null;

  designSystem: string;

}

export function registerHead(templateService: any) {
  templateService.syncAddComponent("head", "head.html");
}

export function createHeadData({ client }: Configuration): HeadData {
  const matomoIsActive =
    client.matomoUrl !== null && client.matomoSiteId !== null;
  const matomoUrl = client.matomoUrl;
  const matomoSiteId = client.matomoSiteId;
  return {
    matomoIsActive,
    matomoUrl,
    matomoSiteId,
    designSystem: client.govDesignSystem,
  };
}
