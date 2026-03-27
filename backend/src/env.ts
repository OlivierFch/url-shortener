import { z } from "zod/v3";
import dotenv from "dotenv";

dotenv.config();

const env = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.string().optional(),
  BASE_URL: z.string().url().default("http://localhost:3000")
}).parse(process.env);

export { env };
