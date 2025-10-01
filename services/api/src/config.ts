import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";
import { z } from "zod";

const ConfigSchema = z.object({
  app: z.object({
    name: z.string(),
    version: z.string(),
    environment: z.string()
  }),
  server: z.object({
    api: z.object({
      host: z.string(),
      port: z.number(),
      corsOrigins: z.array(z.string())
    }),
    web: z.object({
      host: z.string(),
      port: z.number()
    })
  }),
  redis: z.object({
    host: z.string(),
    port: z.number(),
    db: z.number()
  }),
  storage: z.object({
    videoOutputPath: z.string(),
    assetsPath: z.string(),
    auditLogPath: z.string()
  }),
  integrations: z.object({
    youtube: z.object({
      enabled: z.boolean(),
      apiVersion: z.string(),
      scopes: z.array(z.string())
    }),
    googleAds: z.object({
      enabled: z.boolean(),
      apiVersion: z.string()
    }),
    justCall: z.object({
      enabled: z.boolean(),
      webhookPath: z.string(),
      hmacHeader: z.string()
    }),
    copper: z.object({
      enabled: z.boolean(),
      apiVersion: z.string(),
      baseUrl: z.string()
    })
  }),
  rendering: z.object({
    ffmpeg: z.object({
      threads: z.number(),
      preset: z.string(),
      crf: z.number()
    }),
    videoDefaults: z.object({
      resolution: z.string(),
      framerate: z.number(),
      format: z.string(),
      codec: z.string()
    })
  }),
  security: z.object({
    auditLog: z.object({
      enabled: z.boolean(),
      signatureAlgorithm: z.string(),
      keyId: z.string()
    }),
    rateLimiting: z.object({
      enabled: z.boolean(),
      configPath: z.string()
    }),
    hmacVerification: z.object({
      enabled: z.boolean(),
      algorithm: z.string()
    })
  })
});

export type AppConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(): AppConfig {
  const configPath = process.env.CONFIG_PATH || join(process.cwd(), "config", "app.yaml");
  const configFile = readFileSync(configPath, "utf8");
  const rawConfig = parse(configFile);
  return ConfigSchema.parse(rawConfig);
}
