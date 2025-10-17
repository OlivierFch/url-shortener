import { createSlug, findAllLinks, findByLongUrl, findBySlug, incrementHitCount } from "../data-access/index.js";
import { generateSlug } from "../utils/generate-slug/generate-slug.js";
import { canonicalizeUrl } from "../utils/canonicalize-url/canonicalize-url.js";
import { isLongUrlSafe } from "../utils/is-long-url-safe/is-long-url-safe.js";
import { CreateLinkResult } from "../interfaces/index.js";
import { Link } from "@prisma/client";

/**
 * Creates / Retrieves a slug for a given long URL.
 * If the long URL already has a slug, it returns the existing one.
 * Otherwise, it generates a new slug, saves it, and returns it.
 * @param {string} longUrl - The original long URL to be shortened.
 * @returns {Promise<CreateLinkResult>} An object containing a flag indicating if the slug was already created and the Link object.
 */
// TODO: TU
const createSlugByLongUrl = async (longUrl: string): Promise<CreateLinkResult> => {
    const { isSafe, error } = isLongUrlSafe(longUrl);
    if(!isSafe) throw { error: error ?? "Invalid url", statusCode: 400 };
    
    const normalizedUrl = canonicalizeUrl(longUrl);
    const existingLink = await findByLongUrl(normalizedUrl);

    if (existingLink) return { isAlreadyCreated: true, link: existingLink };

    const slug = await generateSlug();
    const createdLink = await createSlug({ longUrl, slug });

    return { isAlreadyCreated: false, link: createdLink };
};

/**
 * Retrieves the long URL associated with a given slug.
 * Increments the hit count for the slug if found.
 * @param {string} slug - The slug to look up.
 * @returns {Promise<Link | null>} The Link object if found, otherwise null.
 */
// TODO: TU
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
