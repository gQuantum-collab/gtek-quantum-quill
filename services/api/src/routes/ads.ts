import { Router, Request, Response } from "express";
import type { IRouter } from "express";
import { GoogleAdsExportRequestSchema } from "@quill/shared";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const router: IRouter = Router();

router.post("/v1/ads/export", (req: Request, res: Response) => {
  const validation = GoogleAdsExportRequestSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: "Invalid request", details: validation.error });
    return;
  }

  const { campaignName, adAssets } = validation.data;
  const timestamp = new Date().toISOString();

  // Create Google Ads compatible JSON spec
  const adsSpec = {
    campaign: {
      name: campaignName,
      status: "PAUSED",
      advertisingChannelType: "DISPLAY",
      biddingStrategyType: "MAXIMIZE_CONVERSIONS"
    },
    assets: adAssets.map((asset, index) => ({
      id: `asset-${index + 1}`,
      type: asset.type,
      path: asset.path,
      text: asset.text
    })),
    metadata: {
      exportedAt: timestamp,
      version: "1.0.0",
      source: "QUILL Studio"
    }
  };

  // Write to file
  const outputDir = join(process.cwd(), "output", "ads");
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const filename = `${campaignName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
  const exportPath = join(outputDir, filename);
  writeFileSync(exportPath, JSON.stringify(adsSpec, null, 2));

  res.json({
    exportPath,
    assetsCount: adAssets.length,
    timestamp
  });
});

export default router;
