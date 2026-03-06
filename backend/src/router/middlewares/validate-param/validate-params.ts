import { NextFunction, RequestHandler, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import { sendError } from "../../../utils/send-error/send-error.ts";

const validateParams = <T>(schema: ZodSchema<T>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success } = schema.safeParse(req.params);
        if (!success) return sendError(res, 400, "bad-request", "Bad Request");

        next();
    };
};

export { validateParams };
