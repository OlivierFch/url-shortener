import { Link } from "@prisma/client";
import { createSlug, findByLongUrl, findBySlug, incrementHitCount } from "../data-access/index.js";
import { generateSlug } from "../utils/generate-slug/generate-slug.js";

type CreateLinkResult = { isAlreadyCreated: boolean, link: Link };

/**
 * Creates / Retrieves a slug for a given long URL.
 * If the long URL already has a slug, it returns the existing one.
 * Otherwise, it generates a new slug, saves it, and returns it.
 * @param {string} longUrl - The original long URL to be shortened.
 * @returns 
 */
// TODO: TU
// TODO: Gérer les erreurs
const createSlugByLongUrl = async (longUrl: string): Promise<CreateLinkResult> => {
    const existingLink = await findByLongUrl(longUrl);

    if (existingLink) {
        return { isAlreadyCreated: true, link: existingLink };
    }

    const slug = await generateSlug();
    const createdLink = await createSlug({ longUrl, slug });

    return { isAlreadyCreated: false, link: createdLink };
};

// TODO: TU
// TODO: Gérer les erreurs
const getLongUrlBySlug = async (slug: string) => {
    const result = await findBySlug(slug);
    if (result) {
        await incrementHitCount(slug);
    }

    return result;
};

export { createSlugByLongUrl, getLongUrlBySlug };
