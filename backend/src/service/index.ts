import { createSlug, findAllLinks, findByLongUrl, findBySlug, incrementHitCount } from "../data-access/index.ts";
import { generateSlug } from "../utils/generate-slug/generate-slug.ts";
import { canonicalizeUrl } from "../utils/canonicalize-url/canonicalize-url.ts";
import { CreateLinkResult } from "../interfaces/index.ts";
import { Prisma } from "@prisma/client";
import type { Link } from "@prisma/client";
import { getSlugLength } from "../utils/get-slug-length/get-slug-length.ts";

const MAX_SLUG_GENERATION_ATTEMPTS = 5;

/**
 * Creates / retrieves a slug for the given long URL.
 * If the slug already exists, it returns the existing link.
 * Otherwise, it generates a new slug and creates a new link.
 * @param {string} longUrl - The long URL to shorten.
 * @returns {Promise<CreateLinkResult>} The result containing the link and whether it was already created.
 */
// TODO: TU
const createSlugByLongUrl = async (longUrl: string): Promise<CreateLinkResult> => {
    const normalizedUrl = canonicalizeUrl(longUrl);

    for (let attempt = 1; attempt <= MAX_SLUG_GENERATION_ATTEMPTS; attempt++) {
        const slugLength = getSlugLength(attempt);
        const slug = generateSlug(slugLength);

        try {
            const createdLink = await createSlug({ longUrl: normalizedUrl, slug });
            return { isAlreadyCreated: false, link: createdLink };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Prisma known error code for unique constraint violation
                if (error?.code === "P2002") {
                    const existingLongUrl = await findByLongUrl(normalizedUrl);
                    if (existingLongUrl) return { isAlreadyCreated: true, link: existingLongUrl };

                    if (attempt === MAX_SLUG_GENERATION_ATTEMPTS) {
                        throw new Error("Unable to generate a unique slug after several attempts.");
                    }
                    continue; // Try again with a new slug
                }
            }
            // Throw other errors
            throw error;
        }
    }

    // This point should not be reachable
    throw new Error("Unreachable code reached in createSlugByLongUrl");
};

/**
 * Retrieves the long URL associated with a given slug.
 * Increments the hit count for the slug if found.
 * @param {string} slug - The slug to look up.
 * @returns {Promise<Link | null>} The Link object if found, otherwise null.
 */
const getUrlBySlug = async (slug: string): Promise<Link | null> => {
    const result = await findBySlug(slug);
    if (result) await incrementHitCount(slug);

    return result;
};

/**
 * Gets all existing links.
 * @returns {Promise<Link[]>} An array of Link objects.
 */
const getLinks = async (): Promise<Link[]> => {
    const links = await findAllLinks();
    return links;
};

export { createSlugByLongUrl, getLinks, getUrlBySlug };
