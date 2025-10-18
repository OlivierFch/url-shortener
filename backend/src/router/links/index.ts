import { Router } from "express";
import { createSlug, redirectUrl, getAllLinks } from "./handler/handler.ts";
import { validateBody } from "../middlewares/validate-body/validate-body.ts";
import { CreateSlugSchema, RedirectUrlSchema } from "./schema/index.ts";
import { validateParams } from "../middlewares/validate-param/validate-params.ts";
import { validateSlugParam } from "../middlewares/validate-slug-param/validate-slug-param.ts";

const linksRouter = Router();

linksRouter.post("/", validateBody(CreateSlugSchema), createSlug);
linksRouter.get("/links", getAllLinks);
linksRouter.get("/:slug", validateParams(RedirectUrlSchema), validateSlugParam, redirectUrl);

export { linksRouter };
