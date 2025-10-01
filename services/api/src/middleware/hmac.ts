import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function verifyHmac(secret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-justcall-signature'] as string;
    
    if (!signature) {
      return res.status(401).json({ error: 'Missing signature' });
    }

    const body = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
  };
}
