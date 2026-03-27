import { createSlug, findAllLinks, findByLongUrl, findBySlug, incrementHitCount, recordVisit, getVisitCountsByLink, findLinksByIds } from "../data-access/index.ts";
import { generateSlug } from "../utils/generate-slug/generate-slug.ts";
import { CalendarWindow, CreateLinkResult, ServiceError, TopLinksSummary } from "../interfaces/index.ts";
import { Prisma } from "@prisma/client";
import type { Link } from "@prisma/client";
import { getSlugLength } from "../utils/get-slug-length/get-slug-length.ts";
import { GetLinksQueryParams } from "../router/links/schema/index.ts";
import { env } from "../env.ts";
import { groupVisitCountsByCategory, getCalendarMonthWindow } from "./top-links.ts";

const MAX_SLUG_GENERATION_ATTEMPTS = 5;

/**
 * Creates / retrieves a slug for the given long URL.
 * If the slug already exists, it returns the existing link.
 * Otherwise, it generates a new slug and creates a new link.
 * @param {string} longUrl - The long URL to shorten.
 * @returns {Promise<CreateLinkResult>} The result containing the link and whether it was already created.
 */
const createSlugByLongUrl = async (longUrl: string, category?: string | null): Promise<CreateLinkResult> => {
    for (let attempt = 1; attempt <= MAX_SLUG_GENERATION_ATTEMPTS; attempt++) {
        const slugLength = getSlugLength(attempt);
        const slug = generateSlug(slugLength);

        try {
            const createdLink = await createSlug({ longUrl: longUrl, slug, category });
            return { isAlreadyCreated: false, link: createdLink };
        } catch (error: any) {
            // Prisma known error code for unique constraint violation
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                const metaTarget = error.meta?.target;
                const target: string[] = Array.isArray(metaTarget) ? metaTarget.filter((mTarget): mTarget is string => typeof mTarget === "string") : [];

                const isConflictOnLongUrl = target.includes("longUrl");
                const isConflictOnSlug = target.includes("slug");

                if (isConflictOnLongUrl) {
                    const existingLongUrl = await findByLongUrl(longUrl);
                    if (existingLongUrl) return { isAlreadyCreated: true, link: existingLongUrl };

                    throw new ServiceError(500, "longurl-conflict", "Long URL conflict detected but not found.");
                }

                if (isConflictOnSlug || !isConflictOnLongUrl) {
                    if (attempt === MAX_SLUG_GENERATION_ATTEMPTS) {
                        throw new ServiceError(409, "slug-collision", "Unable to generate a unique slug after several attempts.");
                    }
                    continue; // Try again with a new slug
                }
            }
            // Throw other errors
            const message = error instanceof Error ? error.message : String(error);
            throw new ServiceError(500, "service-error", `createSlugByLongUrl failed: ${message}`);
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
    if (result) {
        await incrementHitCount(slug);
        try {
            await recordVisit(result.id);
        } catch (error) {
            console.error("Failed to create visit record", error);
        }
    }

    return result;
};

/**
 * Gets all existing links according to filters.
 * @returns {Promise<Link[]>} An array of Link objects.
 */
const getLinks = async (filter?: GetLinksQueryParams): Promise<Link[]> => {
    const links = await findAllLinks(filter);
    return links;
};

const getTopLinksForWindow = async (window: CalendarWindow): Promise<TopLinksSummary> => {
    const { periodStart, periodEnd } = getCalendarMonthWindow(window);
    const visitCounts = await getVisitCountsByLink(periodStart, periodEnd);
    const linkIds = visitCounts.map((entry) => entry.linkId);
    const links = await findLinksByIds(linkIds);

    const categories = visitCounts.length
        ? groupVisitCountsByCategory(visitCounts, links, env.BASE_URL)
        : [];

    return {
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        window,
        categories
    };
};

export { createSlugByLongUrl, getLinks, getUrlBySlug, getTopLinksForWindow, MAX_SLUG_GENERATION_ATTEMPTS };
