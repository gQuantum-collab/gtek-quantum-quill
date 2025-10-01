import { Router } from 'express';
import { LayoutSchema } from '@quill/shared';

const router = Router();

router.post('/v1/layout', (req, res) => {
  const result = LayoutSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid layout data', details: result.error });
  }
  
  res.json({ success: true, layout: result.data });
});

export default router;
