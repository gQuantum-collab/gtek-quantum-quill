import { z } from "zod";

/**
 * Common types for QUILL Studio
 */

export const PaletteGenerateRequestSchema = z.object({
  brandName: z.string().optional(),
  industry: z.string().optional(),
  mood: z.enum(["professional", "playful", "elegant", "bold", "calm"]).optional()
});

export type PaletteGenerateRequest = z.infer<typeof PaletteGenerateRequestSchema>;

export const PaletteGenerateResponseSchema = z.object({
  colors: z.array(z.string()).length(5),
  metadata: z.object({
    mood: z.string(),
    timestamp: z.string()
  })
});

export type PaletteGenerateResponse = z.infer<typeof PaletteGenerateResponseSchema>;

export const LayoutSolveRequestSchema = z.object({
  elements: z.array(z.object({
    type: z.enum(["text", "image", "logo"]),
    content: z.string(),
    priority: z.number().min(1).max(10)
  })),
  canvasWidth: z.number().positive(),
  canvasHeight: z.number().positive()
});

export type LayoutSolveRequest = z.infer<typeof LayoutSolveRequestSchema>;

export const LayoutSolveResponseSchema = z.object({
  layout: z.array(z.object({
    type: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    content: z.string()
  }))
});

export type LayoutSolveResponse = z.infer<typeof LayoutSolveResponseSchema>;

export const VideoRenderRequestSchema = z.object({
  template: z.enum(["30s", "60s"]),
  headline: z.string(),
  colors: z.array(z.string()),
  musicBed: z.string().optional()
});

export type VideoRenderRequest = z.infer<typeof VideoRenderRequestSchema>;

export const VideoRenderResponseSchema = z.object({
  jobId: z.string(),
  status: z.enum(["queued", "processing", "completed", "failed"]),
  videoPath: z.string().optional()
});

export type VideoRenderResponse = z.infer<typeof VideoRenderResponseSchema>;

export const YouTubePublishRequestSchema = z.object({
  videoPath: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  privacyStatus: z.enum(["private", "unlisted", "public"]).default("private")
});

export type YouTubePublishRequest = z.infer<typeof YouTubePublishRequestSchema>;

export const YouTubePublishResponseSchema = z.object({
  status: z.enum(["queued", "uploaded", "failed"]),
  videoId: z.string().optional(),
  url: z.string().optional()
});

export type YouTubePublishResponse = z.infer<typeof YouTubePublishResponseSchema>;

export const GoogleAdsExportRequestSchema = z.object({
  campaignName: z.string(),
  adAssets: z.array(z.object({
    type: z.enum(["image", "video", "headline", "description"]),
    path: z.string().optional(),
    text: z.string().optional()
  }))
});

export type GoogleAdsExportRequest = z.infer<typeof GoogleAdsExportRequestSchema>;

export const GoogleAdsExportResponseSchema = z.object({
  exportPath: z.string(),
  assetsCount: z.number(),
  timestamp: z.string()
});

export type GoogleAdsExportResponse = z.infer<typeof GoogleAdsExportResponseSchema>;
