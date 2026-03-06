import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodSchema } from "zod/v3";
import { sendError } from "../../../utils/send-error/send-error.ts";

const validateQuery = <T>(schema: ZodSchema<T>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, data } = schema.safeParse(req.query);
        if (!success) return sendError(res, 400, "bad-request", "Bad request");
        res.locals.query = data;
        next();
    };
};

export { validateQuery };
