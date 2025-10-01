import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { createLogger } from "@quill/shared";
import { loadConfig } from "./config";

// Import routes
import healthRoutes from "./routes/health";
import paletteRoutes from "./routes/palette";
import layoutRoutes from "./routes/layout";
import exportRoutes from "./routes/export";
import publishRoutes from "./routes/publish";
import adsRoutes from "./routes/ads";
import webhookRoutes from "./routes/webhooks";

const logger = createLogger("api");

async function bootstrap(): Promise<void> {
  // Load and validate configuration
  const config = loadConfig();
  logger.info("Configuration loaded successfully", { environment: config.app.environment });

  const app: Express = express();
  const port = process.env.API_PORT || config.server.api.port;

  // Middleware
  app.use(cors({
    origin: config.server.api.corsOrigins
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging middleware
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info("Incoming request", {
      method: req.method,
      path: req.path,
      ip: req.ip
    });
    next();
  });

  // Mount routes
  app.use(healthRoutes);
  app.use(paletteRoutes);
  app.use(layoutRoutes);
  app.use(exportRoutes);
  app.use(publishRoutes);
  app.use(adsRoutes);
  app.use(webhookRoutes);

  // Error handling middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled error", { error: err.message, stack: err.stack });
    res.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });

  // Start server
  app.listen(port, () => {
    logger.info(`API server listening`, { port, environment: config.app.environment });
  });
}

// Start application
bootstrap().catch((error) => {
  logger.error("Failed to start application", { error: error.message });
  process.exit(1);
});
