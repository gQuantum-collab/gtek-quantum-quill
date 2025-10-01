import { Router, Request, Response } from "express";
import { YouTubePublishRequestSchema } from "@quill/shared";
import { randomUUID } from "crypto";

const router = Router();

router.post("/v1/publish/youtube", (req: Request, res: Response) => {
  const validation = YouTubePublishRequestSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: "Invalid request", details: validation.error });
    return;
  }

  // Stub: In production, this would use YouTube Data API v3
  // OAuth flow would be handled separately
  const jobId = randomUUID();

  res.json({
    status: "queued",
    jobId,
    message: "YouTube upload queued. OAuth authentication required."
  });
});

router.get("/v1/publish/youtube/status/:jobId", (req: Request, res: Response) => {
  const { jobId } = req.params;

  // Stub: Check upload status
  res.json({
    jobId,
    status: "queued",
    message: "Upload pending authentication"
  });
});

export default router;
