import { z } from 'zod';

export const PaletteSchema = z.object({
  colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).min(5).max(5),
});

export const LayoutSchema = z.object({
  type: z.enum(['logo', 'ad', 'video']),
  width: z.number().positive(),
  height: z.number().positive(),
  elements: z.array(z.object({
    type: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  })),
});

export const ExportSchema = z.object({
  format: z.enum(['png', 'jpg', 'mp4']),
  quality: z.number().min(1).max(100).optional(),
});

export const PublishYouTubeSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(5000).optional(),
  videoUrl: z.string().url(),
});

export type Palette = z.infer<typeof PaletteSchema>;
export type Layout = z.infer<typeof LayoutSchema>;
export type Export = z.infer<typeof ExportSchema>;
export type PublishYouTube = z.infer<typeof PublishYouTubeSchema>;
