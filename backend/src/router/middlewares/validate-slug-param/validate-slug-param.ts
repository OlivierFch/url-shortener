import { NextFunction, Request, Response } from "express";

/**
 * Validates the 'slug' parameter in the request.
 * @param {Request} req - Request object containing the slug parameter.
 * @param {Response} res - Response object to send error messages if validation fails.
 * @param {NextFunction} next - Next function to pass control to the next middleware.
 */
// TODO: TU
const validateSlugParam = (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ message: "Bad request", details: "Missing slug parameter" });

    // Validate slug format (alphanumeric, length between 6 and 8)
    const slugRegex = /^[a-zA-Z0-9]{6,8}$/;
    if (!slugRegex.test(slug)) {
        return res.status(400).json({ message: "Bad request", details: "Invalid slug format" });
    }
    next();
};

export { validateSlugParam };
