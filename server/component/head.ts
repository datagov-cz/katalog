import { Configuration } from "../configuration";

export interface HeadData {

  matomoIsActive: boolean;

  matomoUrl: string | null;

  matomoSiteId: string | null;

  designSystemUrl: string;

}

export function registerHead(templateService: any) {
  templateService.syncAddComponent("head", "head.html");
}

export function createHeadData({ client , designSystem}: Configuration): HeadData {
  const matomoIsActive =
    client.matomoUrl !== null && client.matomoSiteId !== null;
  const matomoUrl = client.matomoUrl;
  const matomoSiteId = client.matomoSiteId;
  const designSystemUrl = designSystem.url;
  return {
    matomoIsActive,
    matomoUrl,
    matomoSiteId,
    designSystemUrl,
  };
}
