import { z } from "zod/v3";
import { CATEGORY_VALUES } from "../../../constants/categories.ts";

/**
 * Schema for creating a new slug.
 */
const CreateSlugSchema = z.object({
  longUrl: z.string().trim().url(),
  category: z.enum(CATEGORY_VALUES).optional()
});

/**
 * Schema for redirecting using a slug.
 */
const RedirectUrlSchema = z.object({
  slug: z.string()
});

// Schema for filtering links via query params
const GetLinksQueryParamsSchema = z.object({
  // Sorting
  createdAt: z.enum(["asc", "desc"]).default("desc").optional(),
  hitCount: z.enum(["asc", "desc"]).default("desc").optional(),

  // Pagination
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20).optional(),

  // Search and field filters
  q: z.string().trim().min(1).optional(), // searches slug and longUrl
})

type CreateSlugInput = z.infer<typeof CreateSlugSchema>;
type RedirectUrlInput = z.infer<typeof RedirectUrlSchema>;
type GetLinksQueryParams = z.infer<typeof GetLinksQueryParamsSchema>;

export { CreateSlugSchema, RedirectUrlSchema, GetLinksQueryParamsSchema };
export type { CreateSlugInput, RedirectUrlInput, GetLinksQueryParams };
