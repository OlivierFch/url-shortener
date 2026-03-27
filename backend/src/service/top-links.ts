import type { Link } from "@prisma/client";
import { CalendarWindow, TopLinksCategory, TopUrlItem } from "../interfaces/index.ts";

export const TOP_LINKS_PER_CATEGORY = 3;

export type VisitCountEntry = { linkId: string; visits: number };

export const getCalendarMonthWindow = (
  mode: CalendarWindow,
  referenceDate = new Date()
) => {
  const year = referenceDate.getUTCFullYear();
  const month = referenceDate.getUTCMonth();
  const startMonth = mode === "previous" ? month - 1 : month;
  const endMonth = mode === "previous" ? month : month + 1;

  const periodStart = new Date(Date.UTC(year, startMonth, 1, 0, 0, 0, 0));
  const periodEnd = new Date(Date.UTC(year, endMonth, 1, 0, 0, 0, 0));

  return { periodStart, periodEnd, window: mode };
};

const normalizeBaseUrl = (value: string) => value.endsWith("/") ? value.slice(0, -1) : value;

const getCategoryKey = (category: string | null) => (category ? `category:${category}` : "category:__uncategorized");

export const groupVisitCountsByCategory = (
  visitCounts: VisitCountEntry[],
  links: Link[],
  baseUrl: string,
  perCategoryLimit = TOP_LINKS_PER_CATEGORY
): TopLinksCategory[] => {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const linkById = new Map(links.map((link) => [link.id, link]));
  const orderedCounts = [...visitCounts].sort((a, b) => b.visits - a.visits);
  const grouped = new Map<string, TopLinksCategory>();

  for (const count of orderedCounts) {
    const link = linkById.get(count.linkId);
    if (!link) continue;

    const normalizedCategory = link.category?.trim() || null;
    const bucketKey = getCategoryKey(normalizedCategory);
    const existing = grouped.get(bucketKey) ?? {
      category: normalizedCategory,
      categoryLabel: normalizedCategory ?? "Sans catégorie",
      links: [] as TopUrlItem[]
    };

    if (existing.links.length >= perCategoryLimit) {
      grouped.set(bucketKey, existing);
      continue;
    }

    const shortUrl = `${normalizedBase}/${link.slug}`;
    existing.links.push({
      slug: link.slug,
      longUrl: link.longUrl,
      shortUrl,
      monthlyHits: count.visits,
      category: normalizedCategory
    });
    grouped.set(bucketKey, existing);
  }

  return Array.from(grouped.values());
};
