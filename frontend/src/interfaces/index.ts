interface UrlData {
    slug: string;
    shortUrl: string;
    longUrl: string;
    hitCount: number;
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

export type { UrlData, CreateShortLinkResponse, GetAllLinksResponse, ApiErrorShape };
export { ApiError };
