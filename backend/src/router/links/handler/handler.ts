import { Request, Response } from "express";
import { CalendarWindow, createSlugByLongUrl, getLinks, getTopLinksForWindow, getUrlBySlug } from "../../../service/index.ts";
import { getCategories as getCategoriesList } from "../../../service/categories.ts";
import { toUrlResponse } from "../../../utils/to-url-response/to-url-response.ts";
import { sendError } from "../../../utils/send-error/send-error.ts";
import { env } from "../../../env.ts";

/**
 * Creates a new slug for a given long URL (idempotent).
 * @param {Request} req - Request object containing the body.
 * @param {Response} res - Response object to send the result.
 */
const createSlug = async (req: Request, res: Response) => {
    try {
        const { longUrl, category } = req.body;

        const response = await createSlugByLongUrl(longUrl, category ?? undefined);
        const { isAlreadyCreated, link } = response;

        return res
            .status(isAlreadyCreated ? 200 : 201)
            .send({
                message: isAlreadyCreated ? "Slug already created" : "New slug created",
                data: toUrlResponse(link, env.BASE_URL)
            });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return sendError(res, 400, "invalid-request", "Invalid Request");
        }
        return sendError(res, 500, "internal-server-error", "Internal server error");
    }
};

/**
 * Redirects to the long URL associated with the given slug.
 * @param {Request} req - Request object containing the slug parameter.
 * @param {Response} res - Response object to handle the redirection.
 */
const redirectUrl = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const url = await getUrlBySlug(slug);
        if (!url) return sendError(res, 404, "url-not-found", "Url not found");

        return res.redirect(302, url.longUrl);
    } catch (error) {
        return sendError(res, 500, "internal-server-error", "Internal server error");
    }
};

/**
 * Retrieves all existing links.
 * @param {Request} req - Request object.
 * @param {Response} res - Response object to send the result.
 */
const getAllLinks = async (_req: Request, res: Response) => {
    try {
        const links = await getLinks(res.locals.query);
        return res.status(200).send({ message: "Links retrieved successfully", data: links.map((link) => toUrlResponse(link, env.BASE_URL)) });
    } catch (error: any) {
        if (typeof error?.message === "string" && error.message.includes("Invalid filter value")) {
            return sendError(res, 400, "invalid-request", error.message);
        }
        return sendError(res, 500, "internal-server-error", `Internal server error: ${error}`);
    }
};

const getTopLinks = async (req: Request, res: Response) => {
    try {
        const requestedWindow: CalendarWindow = req.query.window === "current" ? "current" : "previous";
        const summary = await getTopLinksForWindow(requestedWindow);
        return res.status(200).send({ message: "Top links retrieved successfully", data: summary });
    } catch (error: any) {
        return sendError(res, 500, "internal-server-error", `Internal server error: ${error}`);
    }
};

const getCategories = async (_req: Request, res: Response) => {
    try {
        const categories = getCategoriesList();
        return res.status(200).send({ message: "Categories retrieved successfully", data: categories });
    } catch (error: any) {
        return sendError(res, 500, "internal-server-error", `Internal server error: ${error}`);
    }
};

export { createSlug, getAllLinks, getTopLinks, getCategories, redirectUrl };
