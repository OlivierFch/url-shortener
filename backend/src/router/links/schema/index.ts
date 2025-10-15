import { z } from "zod";

/**
 * Payload wanted for POST /api/links
 */
const CreateLinkSchema = z.object({
  longUrl: z.string().url()
});

type CreateLinkInput = z.infer<typeof CreateLinkSchema>;

export { CreateLinkSchema, type CreateLinkInput };
