import type { Link } from "@prisma/client";
import { UrlResponse } from "../../interfaces/index.ts";

/**
 * Converts a Link object to a UrlResponse object.
 * @param {Link} url - The Link object to convert.
 * @param {string} base - The base URL for constructing the short URL. Defaults to "http://localhost:3000".
 * @returns {UrlResponse} The converted UrlResponse object.
 */
const normalizeBaseUrl = (value: string) => (value.endsWith("/") ? value.slice(0, -1) : value);

const toUrlResponse = (url: Link, base = "http://localhost:3000"): UrlResponse => {
    const normalizedBase = normalizeBaseUrl(base);
    return {
        slug: url.slug,
        longUrl: url.longUrl,
        shortUrl: `${normalizedBase}/${url.slug}`,
        hitCount: url.hitCount,
        category: url.category ?? null
    };
};

export { toUrlResponse };
