import { Router, Request, Response } from "express";
import { createHmac } from "crypto";
import { createAuditLogger } from "@quill/shared";

const router = Router();
const auditLogger = createAuditLogger();

function verifyHmac(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");
  return signature === expectedSignature;
}

router.post("/hooks/justcall", (req: Request, res: Response) => {
  const signature = req.headers["x-justcall-signature"] as string;
  const secret = process.env.JUSTCALL_HMAC_SECRET || "default-secret";

  if (!signature) {
    res.status(401).json({ error: "Missing HMAC signature" });
    return;
  }

  const payload = JSON.stringify(req.body);
  const isValid = verifyHmac(payload, signature, secret);

  if (!isValid) {
    res.status(401).json({ error: "Invalid HMAC signature" });
    return;
  }

  // Log to audit trail
  auditLogger.log(
    "justcall.webhook.received",
    "system",
    {
      callId: req.body.callId,
      from: req.body.from,
      to: req.body.to,
      status: req.body.status,
      timestamp: new Date().toISOString()
    }
  );

  // Stub: In production, create lead in Copper CRM
  res.json({
    status: "received",
    message: "Webhook processed successfully"
  });
});

export default router;
