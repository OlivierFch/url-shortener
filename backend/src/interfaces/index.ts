import type { Link } from "@prisma/client";

interface UrlResponse {
    slug: string;
    longUrl: string;
    shortUrl: string;
    hitCount: number;
}

type CreateLinkResult = { isAlreadyCreated: boolean, link: Link };

export type { CreateLinkResult, UrlResponse };
