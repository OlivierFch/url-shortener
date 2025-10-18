interface ShortUrlData {
    slug: string;
    shortUrl: string;
    longUrl: string;
    hitCount: number;
}

interface ShortUrlResponse {
    message: string;
    data: ShortUrlData;
}

export type { ShortUrlData, ShortUrlResponse };
