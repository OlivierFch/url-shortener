import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodSchema } from "zod/v3";

const validateBody = <T>(schema: ZodSchema<T>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, error, data } = schema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Bad request", details: error.flatten() });
        }
        req.body = data;
        next();
    };
};

export { validateBody };
