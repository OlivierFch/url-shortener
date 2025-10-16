import { NextFunction, RequestHandler, Request, Response } from "express";
import { ZodSchema } from "zod/v3";

const validateParams = <T>(schema: ZodSchema<T>): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { success, error, data } = schema.safeParse(req.params);
        if (!success) {
            return res.status(400).json({ message: "Bad request", details: error.flatten() });
        }
        (req as any).params = data;
        next();
    };
};

export { validateParams };
