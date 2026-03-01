import { Prisma, PrismaClient } from "@prisma/client";
import type { Link } from "@prisma/client";
import { GetLinksQueryParams } from "../router/links/schema/index.ts";

export const prisma = new PrismaClient();

const createSlug = async ({ longUrl, slug }: { longUrl: string, slug: string }): Promise<Link> => {
    const result = await prisma.link.create({ data: { longUrl, slug } });
    return result;
};

const findBySlug = async (slug: string): Promise<Link | null> => {
    const result = await prisma.link.findUnique({ where: { slug } });
    return result;
};

const findByLongUrl = async (longUrl: string): Promise<Link | null> => {
    const result = await prisma.link.findUnique({ where: { longUrl } });
    return result;
};

const incrementHitCount = async (slug: string): Promise<void> => {
    await prisma.link.update({
        where: { slug }, data: { hitCount: { increment: 1 } }
    });
};

const filterOptions = (filter?: GetLinksQueryParams) => {
    const where: Prisma.LinkWhereInput = {};
    const orderBy = [];
    if (filter?.hitCount) orderBy.push({ hitCount: filter.hitCount });
    if (filter?.createdAt) orderBy.push({ createdAt: filter.createdAt });
    if (filter?.q) {
        where.OR = [
            { slug: { contains: filter.q, mode: "insensitive" } },
            { longUrl: { contains: filter.q, mode: "insensitive" } }
        ];
    }

    const page = filter?.page ?? 1;
    const limit = filter?.limit ?? 20;
    const skip = filter ? (page - 1) * limit : undefined;
    const take = filter ? limit : undefined;

    return { where, orderBy: orderBy.length ? orderBy : undefined, skip, take };
};

const findAllLinks = async (filter?: GetLinksQueryParams): Promise<Link[]> => {
    const { where, orderBy, skip, take } = filterOptions(filter);
    const result = await prisma.link.findMany({
        where,
        orderBy,
        skip,
        take
    });
    return result;
};

export { createSlug, findAllLinks, findBySlug, findByLongUrl, incrementHitCount };
