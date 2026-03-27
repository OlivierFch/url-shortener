import type { Link } from "@prisma/client";
import { CalendarWindow, getCalendarMonthWindow, groupVisitCountsByCategory } from "./top-links.ts";

describe("top-links helpers", () => {
  test("calendar month window can target previous month", () => {
    const reference = new Date("2026-03-15T12:30:00Z");
    const { periodStart, periodEnd, window } = getCalendarMonthWindow("previous" as CalendarWindow, reference);

    expect(periodStart.toISOString()).toBe("2026-02-01T00:00:00.000Z");
    expect(periodEnd.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    expect(window).toBe("previous");
  });

  test("calendar month window can target current month", () => {
    const reference = new Date("2026-03-10T08:00:00Z");
    const { periodStart, periodEnd, window } = getCalendarMonthWindow("current", reference);

    expect(periodStart.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    expect(periodEnd.toISOString()).toBe("2026-04-01T00:00:00.000Z");
    expect(window).toBe("current");
  });

  test("groupVisitCountsByCategory honors category limits and labels", () => {
    const referenceLinks: Link[] = [
      {
        id: "link-1",
        slug: "news-one",
        longUrl: "https://example.com/news-one",
        hitCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: "Actualités"
      },
      {
        id: "link-2",
        slug: "news-two",
        longUrl: "https://example.com/news-two",
        hitCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: "Actualités"
      },
      {
        id: "link-3",
        slug: "uncategorized",
        longUrl: "https://example.com/uncategorized",
        hitCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: null
      },
      {
        id: "link-4",
        slug: "still-uncategorized",
        longUrl: "https://example.com/still-uncategorized",
        hitCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: ""
      }
    ];

    const visitCounts = [
      { linkId: "link-1", visits: 12 },
      { linkId: "link-2", visits: 7 },
      { linkId: "link-3", visits: 3 },
      { linkId: "link-4", visits: 1 }
    ];

    const grouped = groupVisitCountsByCategory(visitCounts, referenceLinks, "http://example.com");

    expect(grouped).toHaveLength(2);
    expect(grouped[0].categoryLabel).toBe("Actualités");
    expect(grouped[0].links[0].slug).toBe("news-one");
    expect(grouped[0].links[0].monthlyHits).toBe(12);
    expect(grouped[0].links[1].slug).toBe("news-two");
    expect(grouped[1].categoryLabel).toBe("Sans catégorie");
    expect(grouped[1].links).toHaveLength(2);
    expect(grouped[1].links[0].shortUrl).toBe("http://example.com/uncategorized");
  });
});
