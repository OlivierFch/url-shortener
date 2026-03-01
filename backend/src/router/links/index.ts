import { Router } from "express";
import { createSlug, redirectUrl, getAllLinks } from "./handler/handler.ts";
import { validateBody } from "../middlewares/validate-body/validate-body.ts";
import { CreateSlugSchema, RedirectUrlSchema, GetLinksQueryParamsSchema } from "./schema/index.ts";
import { validateParams } from "../middlewares/validate-param/validate-params.ts";
import { validateSlugParam } from "../middlewares/validate-slug-param/validate-slug-param.ts";
import { validateLongUrlBody } from "../middlewares/validate-long-url-body/validate-long-url-body.ts";
import { validateQuery } from "../middlewares/validate-query/validate-query.ts";

const linksRouter = Router();

linksRouter.post("/", validateBody(CreateSlugSchema), validateLongUrlBody, createSlug);
linksRouter.get("/links", validateQuery(GetLinksQueryParamsSchema), getAllLinks);
linksRouter.get("/:slug", validateParams(RedirectUrlSchema), validateSlugParam, redirectUrl);

export { linksRouter };
