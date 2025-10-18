import type { Link } from "@prisma/client";
import { UrlResponse } from "../../interfaces/index.ts";

/**
 * Converts a Link object to a UrlResponse object.
 * @param {Link} url - The Link object to convert.
 * @param {string} base - The base URL for constructing the short URL. Defaults to "http://localhost:3000".
 * @returns {UrlResponse} The converted UrlResponse object.
 */
// TODO: TU
const toUrlResponse = (url: Link, base = "http://localhost:3000"): UrlResponse => {
    return {
        slug: url.slug,
        longUrl: url.longUrl,
        shortUrl: `${base}/${url.slug}`,
        hitCount: url.hitCount
    };
};

export { toUrlResponse };
