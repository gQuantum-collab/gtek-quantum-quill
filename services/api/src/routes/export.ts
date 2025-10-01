import { Router } from 'express';
import { ExportSchema } from '@quill/shared';

const router = Router();

router.post('/v1/export', (req, res) => {
  const result = ExportSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid export data', details: result.error });
  }
  
  res.json({ success: true, export: result.data, url: '/exports/sample.png' });
});

export default router;
