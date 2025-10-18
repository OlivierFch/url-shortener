import { Link } from "@prisma/client";
import { findAllLinks, findBySlug, incrementHitCount } from "../data-access/index.ts";
import { getLinks, getUrlBySlug } from "./index.ts";

jest.mock('nanoid', () => ({
  customAlphabet: () => () => 'mocked-id',
}));
jest.mock("normalize-url", () => ({
  normalizeUrl: (url: string) => url,
}));

jest.mock("../data-access/index.ts", () => ({
    findAllLinks: jest.fn(),
    findBySlug: jest.fn(),
    incrementHitCount: jest.fn()
}));

describe("Unit tests for links service", () => {

    describe("Unit test for getUrlBySlug", () => {
        const mockedFindBySlug = jest.mocked(findBySlug);
        const mockedIncrementHitCount = jest.mocked(incrementHitCount);

        beforeEach(() => {
            jest.clearAllMocks();
        });

        test("getUrlBySlug should return the link and increment 'hitCount' when the slug exists", async () => {
            const link: Link = {
                id: "uuid-1",
                slug: "abc123",
                longUrl: "https://example.com/a",
                hitCount: 10,
                createdAt: new Date("2025-01-01T10:00:00Z"),
                updatedAt: new Date("2025-01-01T10:00:00Z"),
            };

            mockedFindBySlug.mockResolvedValueOnce(link);
            mockedIncrementHitCount.mockResolvedValueOnce(undefined as unknown as any);

            const result = await getUrlBySlug("abc123");

            expect(result).toEqual(link);
            expect(mockedIncrementHitCount).toHaveBeenCalledTimes(1);
        });

        test("getUrlBySlug should return 'null' and not increment 'hitCount' when the slug is unknown", async () => {
            const slug = "unknown";
            mockedFindBySlug.mockResolvedValueOnce(null);

            const result = await getUrlBySlug(slug);

            expect(result).toBeNull();
            expect(mockedFindBySlug).toHaveBeenCalledWith(slug);
            expect(mockedIncrementHitCount).not.toHaveBeenCalled();
        });

        test("should throw an error if incrementHitCount fail", async () => {
            const link: Link = {
                id: "uuid-1",
                slug: "abc123",
                longUrl: "https://example.com/a",
                hitCount: 10,
                createdAt: new Date("2025-01-01T10:00:00Z"),
                updatedAt: new Date("2025-01-01T10:00:00Z"),
            };

            mockedFindBySlug.mockResolvedValueOnce(link);
            mockedIncrementHitCount.mockRejectedValueOnce(new Error('DB write failed'));

            await expect(getUrlBySlug("abc123")).rejects.toThrow('DB write failed');

        });
    });

    describe("Unit test for getLinks", () => {
        const mockedfindAllLinks = jest.mocked(findAllLinks);

        test("getLinks should return all links", async () => {
            const fakeLinks = [
                {
                    id: 'uuid-1',
                    slug: 'abc123',
                    longUrl: 'https://example.com/a',
                    hitCount: 0,
                    createdAt: new Date('2025-01-01T10:00:00Z'),
                    updatedAt: new Date('2025-01-01T10:00:00Z'),
                },
                {
                    id: 'uuid-2',
                    slug: 'xyz789',
                    longUrl: 'https://example.com/b',
                    hitCount: 5,
                    createdAt: new Date('2025-01-02T10:00:00Z'),
                    updatedAt: new Date('2025-01-02T10:00:00Z'),
                },
            ];
            
            mockedfindAllLinks.mockResolvedValueOnce(fakeLinks);

            const result = await getLinks();
            expect(result).toStrictEqual(fakeLinks);
            expect(mockedfindAllLinks).toHaveBeenCalledTimes(1);
        });
    });
});