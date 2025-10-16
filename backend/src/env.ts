import { z } from "zod/v3";
import dotenv from "dotenv";

dotenv.config();

const env = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().optional()
}).parse(process.env);

export { env };