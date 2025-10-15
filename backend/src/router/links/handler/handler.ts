import { Request, Response } from "express";
import { createSlugByLongUrl } from "../../../service/index.js";
import { CreateLinkInput, CreateLinkSchema } from "../schema/index.js";
import { toUrlResponse } from "../../../utils/to-url-response/to-url-response.js";
import { canonicalizeUrl } from "../../../utils/canonicalize-url/canonicalize-url.js";

/**
 * Creates a new slug for a given long URL (idempotent).
 * @param {Request<CreateLinkInput>} req - Request object containing the long URL in the body.
 * @param {Response} res - Response object to send the result.
 */
// TODO: Gérer les erreurs
// TODO: TU
const handlePostLink = async (req: Request<unknown, unknown, CreateLinkInput>, res: Response) => {
    const parsed = CreateLinkSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).send({ message: "Invalid request", details: parsed.error.flatten() });
    }

    try {
        const normalized = canonicalizeUrl(parsed.data.longUrl);

        const response = await createSlugByLongUrl(normalized);
        const { isAlreadyCreated, link } = response;

        return res
            .status(isAlreadyCreated ? 200 : 201)
            .send({
                message: isAlreadyCreated ? "Slug already created" : "New slug created",
                data: toUrlResponse(link)
            });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return res.status(400).send({ error: "Invalid request", details: error.flatten() } );
        }
        return res.status(500).send({ message: "Internal server error" });
    }
};

export { handlePostLink };
