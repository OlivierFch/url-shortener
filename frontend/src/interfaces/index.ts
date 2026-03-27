interface UrlData {
    slug: string;
    shortUrl: string;
    longUrl: string;
    hitCount: number;
    category?: string | null;
}

interface CreateShortLinkResponse {
    message: string;
    data: UrlData;
}

interface GetAllLinksResponse {
    message: string;
    data: UrlData[];
}

interface ApiErrorShape {
    type: string;
    title: string;
    status: number;
    detail?: string;
}

interface CategoryOption {
    value: string;
    label: string;
}

interface CategoriesResponse {
    message: string;
    data: CategoryOption[];
}

interface TopUrlItem {
    slug: string;
    longUrl: string;
    shortUrl: string;
    monthlyHits: number;
    category?: string | null;
}

type TopLinksWindow = "previous" | "current";

interface TopLinksCategory {
    category: string | null;
    categoryLabel: string;
    links: TopUrlItem[];
}

interface TopLinksResponse {
    message: string;
    data: {
        periodStart: string;
        periodEnd: string;
        window: TopLinksWindow;
        categories: TopLinksCategory[];
    };
}

class ApiError extends Error {
    readonly type: string;
    readonly status: number;
    readonly detail?: string;
    readonly title: string;

    constructor(err: ApiErrorShape) {
        super(err.title);
        this.name = "ApiError";
        this.type = err.type;
        this.status = err.status;
        this.detail = err.detail;
        this.title = err.title;
    }
}

export type { UrlData, CreateShortLinkResponse, GetAllLinksResponse, ApiErrorShape, TopLinksResponse, TopLinksCategory, TopUrlItem, TopLinksWindow, CategoryOption, CategoriesResponse };
export { ApiError };
