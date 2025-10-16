import { NextFunction, Request, Response } from "express";

const validateSlugParam = (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ message: "Bad request", details: "Missing slug parameter" });

    // Validate slug (alphanumeric, 6 characters)
    const slugRegex = /^[a-zA-Z0-9]{6}$/;
    if (!slugRegex.test(slug)) {
        return res.status(400).json({ message: "Bad request", details: "Invalid slug format" });
    }
    next();
};

export { validateSlugParam };
