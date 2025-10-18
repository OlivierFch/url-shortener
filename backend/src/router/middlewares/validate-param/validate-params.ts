import { NextFunction, RequestHandler, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import { sendError } from "../../../utils/send-error/send-error.ts";

const validateParams = <T>(schema: ZodSchema<T>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, error, data } = schema.safeParse(req.params);
        if (!success) return sendError(res, 400, "bad-request", "Bad Request");

        (req as any).params = data;
        next();
    };
};

export { validateParams };
