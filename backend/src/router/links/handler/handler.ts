import { Request, Response } from "express";
import { createSlugByLongUrl, getUrlBySlug } from "../../../service/index.js";
import { toUrlResponse } from "../../../utils/to-url-response/to-url-response.js";

/**
 * Creates a new slug for a given long URL (idempotent).
 * @param {Request} req - Request object containing the body.
 * @param {Response} res - Response object to send the result.
 */
// TODO: Gérer les erreurs
// TODO: TU
const createSlug = async (req: Request, res: Response) => {
    try {
        const { longUrl } = req.body;

        const response = await createSlugByLongUrl(longUrl);
        const { isAlreadyCreated, link } = response;

        return res
            .status(isAlreadyCreated ? 200 : 201)
            .send({
                message: isAlreadyCreated ? "Slug already created" : "New slug created",
                data: toUrlResponse(link)
            });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).json({ error: "Invalid request", details: error.flatten() } );
        }
        if (error?.statusCode) {
            return res.status(error.statusCode).json({ message: error.error, details: error.flatten() });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Redirects to the long URL associated with the given slug.
 * @param {Request} req - Request object containing the slug parameter.
 * @param {Response} res - Response object to handle the redirection.
 */
// TODO: TU
const redirectUrl = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        if (!slug) return res.status(400).json({ message: "Bad request", details: "Missing slug" });

        const url = await getUrlBySlug(slug);
        if (!url) return res.status(404).json({ message: "Not found", details: "Url not found" });

        return res.redirect(302, url.longUrl);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { createSlug, redirectUrl };
