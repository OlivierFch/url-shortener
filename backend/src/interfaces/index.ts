import type { Link } from "@prisma/client";

interface UrlResponse {
    slug: string;
    longUrl: string;
    shortUrl: string;
    hitCount: number;
}

type CreateLinkResult = { isAlreadyCreated: boolean, link: Link };

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
export type { CreateLinkResult, UrlResponse };
