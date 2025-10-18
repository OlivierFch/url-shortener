import { env } from "../env";
import { ShortUrlResponse } from "../interfaces";

const BASE = env.VITE_API_BASE_URL ?? "http://localhost:3000";

/**
 * Creates a new short link for the given long URL.
 * @param {string} longUrl - The original long URL to be shortened.
 * @returns {Promise<ShortUrlResponse>} The response containing the short url details.
 */
// TODO: TU
const createShortLink = async (longUrl: string): Promise<ShortUrlResponse> => {
    const res = await fetch(`${BASE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message ?? `HTTP ${res.status}`);
    }
    return res.json();
}

/**
 * Gets the url details for a given slug.
 * @param {string} slug - The slug of the short link.
 * @returns {Promise<ShortUrlResponse>} The response containing the link details.
 */
// TODO: TU
const getLink = async (slug: string): Promise<ShortUrlResponse> => {
    const res = await fetch(`${BASE}/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error(`Not found (${res.status})`);
    return res.json();
}

/**
 * Gets all existing urls.
 * @returns {Promise<ShortUrlResponse[]>} An array of short link responses.
 */
// TODO: TU
const getAllLinks = async (): Promise<ShortUrlResponse[]> => {
    const res = await fetch(`${BASE}/links`);
    if (!res.ok) throw new Error(`Error fetching urls (${res.status})`);
    return res.json();
};

export { createShortLink, getLink, getAllLinks };
