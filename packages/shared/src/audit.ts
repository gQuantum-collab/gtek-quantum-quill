import { createHash } from "crypto";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

/**
 * Non-repudiation audit log writer
 * Append-only JSONL format with event, actor, timestamp, sha256, and signature kid
 */

export interface AuditLogEntry {
  event: string;
  actor: string;
  timestamp: string;
  payload: Record<string, unknown>;
  sha256: string;
  signatureKid: string;
}

export class AuditLogger {
  private logDir: string;
  private logFile: string;

  constructor(logDir = "./audit-logs") {
    this.logDir = logDir;
    this.logFile = join(logDir, "audit.jsonl");
    
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
  }

  log(event: string, actor: string, payload: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const dataToHash = JSON.stringify({ event, actor, timestamp, payload });
    const sha256 = createHash("sha256").update(dataToHash).digest("hex");
    
    const entry: AuditLogEntry = {
      event,
      actor,
      timestamp,
      payload,
      sha256,
      signatureKid: "key-v1" // Placeholder for signature key identifier
    };

    const line = JSON.stringify(entry) + "\n";
    appendFileSync(this.logFile, line, "utf8");
  }
}

export function createAuditLogger(logDir?: string): AuditLogger {
  return new AuditLogger(logDir);
}
