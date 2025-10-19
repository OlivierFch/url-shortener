import { Link, Prisma } from "@prisma/client";
import { createSlug, findAllLinks, findByLongUrl, findBySlug, incrementHitCount } from "../data-access/index.ts";
import { createSlugByLongUrl, getLinks, getUrlBySlug, MAX_SLUG_GENERATION_ATTEMPTS } from "./index.ts";
import { getSlugLength } from "../utils/get-slug-length/get-slug-length.ts";
import { generateSlug } from "../utils/generate-slug/generate-slug.ts";

jest.mock("../utils/get-slug-length/get-slug-length.ts", () => ({
    getSlugLength: jest.fn()
}));

jest.mock("../utils/generate-slug/generate-slug.ts", () => ({
    generateSlug: jest.fn()
}));

jest.mock("../data-access/index.ts", () => ({
    createSlug: jest.fn(),
    findAllLinks: jest.fn(),
    findByLongUrl: jest.fn(),
    findBySlug: jest.fn(),
    incrementHitCount: jest.fn()
}));

jest.mock('@prisma/client', () => {
  class PrismaClientKnownRequestError extends Error {
    code: string;
    constructor(message: string, code: string) {
      super(message);
      this.name = 'PrismaClientKnownRequestError';
      this.code = code;
    }
  }
  return { Prisma: { PrismaClientKnownRequestError } };
});

const createLink = (): Link => {
    return {
        id: 'uuid-1',
        slug: "xxxxxx",
        longUrl: "https://medium.com/equify-tech/the-three-fundamental-stages-of-an-engineering-career-54dac732fc74",
        hitCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};

describe("Unit tests for links service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    })

    describe("Unit test for createSlugByLongUrl", () => {
        const longUrl = "https://medium.com/equify-tech/the-three-fundamental-stages-of-an-engineering-career-54dac732fc74";

        const mockedCreateSlug = jest.mocked(createSlug);
        const mockedGetSlugLength = jest.mocked(getSlugLength);
        const mockedGenerateSlug = jest.mocked(generateSlug);
        const mockedFindByLongUrl = jest.mocked(findByLongUrl);

        beforeEach(() => {
            jest.clearAllMocks();
            mockedGetSlugLength.mockImplementation((attempt: number) => attempt);
            mockedGenerateSlug.mockImplementation((len?: number) => "x".repeat(len ?? 0));
        })
        
        test("createSlugByLongUrl should create a new slug when the long url is new", async () => {
            const created = createLink();
            mockedCreateSlug.mockResolvedValue(created);

            const result = await createSlugByLongUrl(longUrl);
            expect(result).toStrictEqual({ isAlreadyCreated: false, link: created });
            expect(mockedFindByLongUrl).not.toHaveBeenCalled();
        });

        test("createSlugByLongUrl should return an existing slug when there is a collision (P2002) on 'longUrl'", async () => {
            const prismaError = new (Prisma as any).PrismaClientKnownRequestError("Unique constraint failed", "P2002");

            mockedCreateSlug.mockRejectedValue(prismaError);
            const existingLink = createLink();
            mockedFindByLongUrl.mockResolvedValue(existingLink);

            const result = await createSlugByLongUrl(longUrl);
            expect(result).toStrictEqual({ isAlreadyCreated: true, link: existingLink });
        });

        test("createSlugByLongUrl should retry and success when there is a collision (P2002) on 'slug' with no existing 'longUrl'", async () => {
            const prismaError = new (Prisma as any).PrismaClientKnownRequestError("Unique constraint failed", "P2002");
            const created = createLink();

            mockedCreateSlug
                .mockRejectedValueOnce(prismaError) // First try -> Collision "P2002"
                .mockResolvedValueOnce(created); // Second try -> Success

            mockedFindByLongUrl.mockResolvedValueOnce(null);

            const result = await createSlugByLongUrl(longUrl);

            expect(mockedCreateSlug).toHaveBeenCalledTimes(2);
            expect(result).toStrictEqual({ isAlreadyCreated: false, link: created });
        });

        test("createSlugByLongUrl should throw an error after we reach all attempts possible due to collision 'P2002' on 'slug'", async () => {
            const prismaError = new (Prisma as any).PrismaClientKnownRequestError("Unique constraint failed", "P2002");

            for (let i = 0; i < MAX_SLUG_GENERATION_ATTEMPTS; i++) {
                mockedCreateSlug.mockRejectedValueOnce(prismaError);
                mockedFindByLongUrl.mockResolvedValueOnce(null);
            }

            await expect(createSlugByLongUrl(longUrl)).rejects.toThrow("Unable to generate a unique slug after several attempts.");
            expect(mockedCreateSlug).toHaveBeenCalledTimes(MAX_SLUG_GENERATION_ATTEMPTS);
            expect(mockedFindByLongUrl).toHaveBeenCalledTimes(MAX_SLUG_GENERATION_ATTEMPTS);
        });

        test("createSlugByLongUrl should retry if a Prisma error different from 'P2002' is detected", async () => {
            const prismaError = new (Prisma as any).PrismaClientKnownRequestError("Value stored in database is invalid for the field's type", "P2005");
            mockedCreateSlug.mockRejectedValueOnce(prismaError);

            await expect(createSlugByLongUrl(longUrl)).rejects.toThrow(prismaError);
            expect(mockedFindByLongUrl).not.toHaveBeenCalled();
        });

        test("createSlugByLongUrl should retry when it detects a non-Prisma error", async () => {
            const error = new Error("DB down");
            mockedCreateSlug.mockRejectedValueOnce(error);

            await expect(createSlugByLongUrl(longUrl)).rejects.toThrow("DB down");
            expect(mockedFindByLongUrl).not.toHaveBeenCalled();
        });
    });

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
            expect(result?.hitCount).toBe(link.hitCount++);
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