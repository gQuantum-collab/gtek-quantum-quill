import { Router } from 'express';
import { PaletteSchema } from '@quill/shared';

const router = Router();

// Generate 5 random hex colors
function generatePalette(): string[] {
  const colors: string[] = [];
  for (let i = 0; i < 5; i++) {
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    colors.push(color);
  }
  return colors;
}

router.get('/v1/palette', (req, res) => {
  const colors = generatePalette();
  const palette = { colors };
  
  // Validate with zod schema
  const result = PaletteSchema.safeParse(palette);
  
  if (!result.success) {
    return res.status(500).json({ error: 'Failed to generate valid palette' });
  }
  
  res.json(result.data);
});

export default router;
