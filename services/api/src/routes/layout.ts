import { Router, Request, Response } from "express";
import type { IRouter } from "express";
import { LayoutSolveRequestSchema } from "@quill/shared";
import layoutManifest from "@quill/quantumes/layout.solve.json";

const router: IRouter = Router();

function solveLayout(elements: Array<{ type: string; content: string; priority: number }>, canvasWidth: number, canvasHeight: number) {
  const layout = [];
  const margins = layoutManifest.parameters.margins;
  const availableWidth = canvasWidth - margins.left - margins.right;
  const availableHeight = canvasHeight - margins.top - margins.bottom;

  // Sort by priority (higher first)
  const sorted = [...elements].sort((a, b) => b.priority - a.priority);

  let currentY = margins.top;

  for (const element of sorted) {
    const rules = layoutManifest.rules.hierarchy[element.type as keyof typeof layoutManifest.rules.hierarchy];
    const minSize = rules?.minSize || { width: 100, height: 50 };

    // Simple vertical stacking layout
    const width = Math.min(minSize.width, availableWidth);
    const height = Math.min(minSize.height, availableHeight - (currentY - margins.top));
    const x = margins.left + (availableWidth - width) / 2; // Center horizontally

    layout.push({
      type: element.type,
      x: Math.round(x),
      y: Math.round(currentY),
      width: Math.round(width),
      height: Math.round(height),
      content: element.content
    });

    currentY += height + layoutManifest.rules.spacing.minDistance;
  }

  return layout;
}

router.post("/v1/layout/solve", (req: Request, res: Response) => {
  const validation = LayoutSolveRequestSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: "Invalid request", details: validation.error });
    return;
  }

  const { elements, canvasWidth, canvasHeight } = validation.data;
  const layout = solveLayout(elements, canvasWidth, canvasHeight);

  res.json({ layout });
});

export default router;
