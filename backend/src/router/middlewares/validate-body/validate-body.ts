import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodSchema } from "zod/v3";
import { sendError } from "../../../utils/send-error/send-error.ts";

const validateBody = <T>(schema: ZodSchema<T>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, error, data } = schema.safeParse(req.body);
        if (!success) return sendError(res, 400, "bad-request", "Bad request");

        req.body = data;
        next();
    };
};

export { validateBody };
