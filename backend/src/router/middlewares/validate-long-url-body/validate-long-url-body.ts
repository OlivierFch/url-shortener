import { NextFunction, Request, Response } from "express";

// TODO: Add JSDoc
// TODO: TU
// TODO: Add necessary validations (e.g., URL format)
// TODO: Implement actual safety checks (e.g., against a list of known malicious URLs)
const validateLongUrlBody = (req: Request, res: Response, next: NextFunction) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ message: "Bad request", details: "Missing longUrl in request body" });

    next();
};

export { validateLongUrlBody };
