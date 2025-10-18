import { PrismaClient } from "@prisma/client";
import type { Link } from "@prisma/client";

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

const findAllLinks = async (): Promise<Link[]> => {
    const result = await prisma.link.findMany();
    return result;
};

export { createSlug, findAllLinks, findBySlug, findByLongUrl, incrementHitCount };
