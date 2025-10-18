import type { Request, Response } from "express";
import { sendError } from "../../../utils/send-error/send-error.ts";

const notFound = (_req: Request, res: Response) => {
  return sendError(res, 404, "not-found", "Route not found");
};

export { notFound };
