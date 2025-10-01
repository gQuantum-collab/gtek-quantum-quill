import { Router, Request, Response } from "express";
import type { IRouter } from "express";
import { VideoRenderRequestSchema } from "@quill/shared";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.post("/v1/export/render", (req: Request, res: Response) => {
  const validation = VideoRenderRequestSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: "Invalid request", details: validation.error });
    return;
  }

  const jobId = randomUUID();

  // In production, this would queue the job to the render worker
  res.json({
    jobId,
    status: "queued",
    message: "Video render job queued successfully"
  });
});

router.get("/v1/export/status/:jobId", (req: Request, res: Response) => {
  const { jobId } = req.params;

  // In production, check actual job status
  res.json({
    jobId,
    status: "processing",
    progress: 45
  });
});

export default router;
