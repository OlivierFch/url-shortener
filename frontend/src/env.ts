import { z } from "zod/v3";

const env = z.object({
  VITE_API_BASE_URL: z.string().url()
}).parse(import.meta.env);

export { env };