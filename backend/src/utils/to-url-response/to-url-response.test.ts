import { toUrlResponse } from "./to-url-response.ts";

describe("Unit test for toUrlResponse", () => {
    test("toUrlResponse should convert link to url reponse", () => {
        const result = toUrlResponse({
            id: "1",
            slug: "abc123",
            longUrl: "https://example.com/some/long/url",
            hitCount: 10,
            category: "news",
            createdAt: new Date("2024-01-01T00:00:00Z"),
            updatedAt: new Date("2024-01-01T00:00:00Z")
        }, "http://localhost:4000/");

        expect(result).toStrictEqual({
            slug: "abc123",
            longUrl: "https://example.com/some/long/url",
            shortUrl: "http://localhost:4000/abc123",
            hitCount: 10,
            category: "news"
        });
    });
});
