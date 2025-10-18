import { z } from "zod";

/**
 * Represents the regex pattern for validating URLs.
 * This pattern checks for optional http/https scheme, valid domain,
 * and optional path, query, or fragment.
 */
const URL_PATTERN = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}([/?#].*)?$/i;

const httpBase = "http://"
const httpsBase = "https://"

const urlSchema = z.object({
  longUrl: z.string()
    .trim()
    .min(1, "L'URL est requise")
    .refine((url: string) => URL_PATTERN.test(url), "Format d'URL invalide")
    .transform((url: string) => (url.startsWith(httpBase) || url.startsWith(httpsBase) ? url : `${httpsBase}${url}`))
    .pipe(z.string().url("URL invalide"))
});

type Url = z.infer<typeof urlSchema>;

//const formSchema = z.object(urlStringSchema);
//type FormData = z.infer<typeof formSchema>;

export { urlSchema, URL_PATTERN };
export type { Url };
