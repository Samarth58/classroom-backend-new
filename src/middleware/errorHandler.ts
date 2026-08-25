import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  // Check for JSON parse / SyntaxError from express.json()
  if (
    (err instanceof SyntaxError || err?.name === "SyntaxError") &&
    (err?.status === 400 || err?.statusCode === 400) &&
    "body" in err
  ) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  // Log actual error server-side for debugging
  console.error("Unhandled Server Error:", err);

  // Return generic structured 500 error response to client
  return res.status(500).json({ error: "Internal Server Error" });
};
