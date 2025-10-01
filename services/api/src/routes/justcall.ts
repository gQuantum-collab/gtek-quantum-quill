import { Router } from 'express';
import { verifyHmac } from '../middleware/hmac';

const router = Router();

const JUSTCALL_SECRET = process.env.JUSTCALL_SECRET || 'test-secret';

router.post('/hooks/justcall', verifyHmac(JUSTCALL_SECRET), (req, res) => {
  console.log('JustCall webhook received:', req.body);
  res.json({ success: true, received: true });
});

export default router;
