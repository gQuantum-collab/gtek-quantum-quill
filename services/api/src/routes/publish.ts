import { Router } from 'express';
import { PublishYouTubeSchema } from '@quill/shared';

const router = Router();

router.post('/v1/publish/youtube', (req, res) => {
  const result = PublishYouTubeSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ error: 'Invalid publish data', details: result.error });
  }
  
  res.json({ success: true, videoId: 'mock-video-id', url: 'https://youtube.com/watch?v=mock-video-id' });
});

export default router;
