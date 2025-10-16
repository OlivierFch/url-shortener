import { z } from "zod/v3";

/**
 * Schema for creating a new slug.
 */
const CreateSlugSchema = z.object({
  longUrl: z.string().trim().url()
});

/**
 * Schema for redirecting using a slug.
 */
const RedirectUrlSchema = z.object({
  slug: z.string()
});

type CreateSlugInput = z.infer<typeof CreateSlugSchema>;
type RedirectUrlInput = z.infer<typeof RedirectUrlSchema>;

export { CreateSlugSchema, RedirectUrlSchema };
export type { CreateSlugInput, RedirectUrlInput };
