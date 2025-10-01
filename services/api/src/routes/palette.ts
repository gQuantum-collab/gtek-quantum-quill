import { Router, Request, Response } from "express";
import { PaletteGenerateRequestSchema } from "@quill/shared";
import paletteManifest from "@quill/quantumes/palette.generate.json";

const router = Router();

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette(mood: string = "professional"): string[] {
  const preset = paletteManifest.presets[mood as keyof typeof paletteManifest.presets] || paletteManifest.presets.professional;
  const colors: string[] = [];
  
  for (let i = 0; i < 5; i++) {
    const hue = preset.baseHues[i % preset.baseHues.length];
    const saturation = preset.saturationRange[0] + Math.random() * (preset.saturationRange[1] - preset.saturationRange[0]);
    const lightness = preset.lightnessRange[0] + Math.random() * (preset.lightnessRange[1] - preset.lightnessRange[0]);
    colors.push(hslToHex(hue, saturation, lightness));
  }
  
  return colors;
}

router.post("/v1/palette/generate", (req: Request, res: Response) => {
  const validation = PaletteGenerateRequestSchema.safeParse(req.body);
  
  if (!validation.success) {
    res.status(400).json({ error: "Invalid request", details: validation.error });
    return;
  }

  const { mood = "professional" } = validation.data;
  const colors = generatePalette(mood);

  res.json({
    colors,
    metadata: {
      mood,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
