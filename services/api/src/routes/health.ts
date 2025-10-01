import { Router, Request, Response } from "express";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "quill-api",
    version: "1.0.0"
  });
});

export default router;
