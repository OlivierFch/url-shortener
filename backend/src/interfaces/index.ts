import type { Link } from "@prisma/client";

interface UrlResponse {
    slug: string;
    longUrl: string;
    shortUrl: string;
    hitCount: number;
    category?: string | null;
}

type CreateLinkResult = { isAlreadyCreated: boolean, link: Link };

interface TopUrlItem {
    slug: string;
    longUrl: string;
    shortUrl: string;
    monthlyHits: number;
    category?: string | null;
}

type CalendarWindow = "previous" | "current";

interface TopLinksCategory {
    category: string | null;
    categoryLabel: string;
    links: TopUrlItem[];
}

interface TopLinksSummary {
    periodStart: string;
    periodEnd: string;
    window: CalendarWindow;
    categories: TopLinksCategory[];
}

class ServiceError extends Error {
    readonly status: number;
    readonly code: string;

    constructor(status: number, code: string, message: string) {
        super(message);
        this.name = "ServiceError";
        this.status = status;
        this.code = code;
    }
}

export { ServiceError };
export type { CreateLinkResult, UrlResponse, TopUrlItem, TopLinksCategory, TopLinksSummary, CalendarWindow };
