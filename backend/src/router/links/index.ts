import { Router } from "express";
import { createSlug, redirectUrl, getAllLinks } from "./handler/handler.js";
import { validateBody } from "../middlewares/validate-body/validate-body.js";
import { CreateSlugSchema, RedirectUrlSchema } from "./schema/index.js";
import { validateParams } from "../middlewares/validate-param/validate-params.js";
import { validateSlugParam } from "../middlewares/validate-slug-param/validate-slug-param.js";

const linksRouter = Router();

linksRouter.post("/", validateBody(CreateSlugSchema), createSlug);
linksRouter.get("/links", getAllLinks);
linksRouter.get("/:slug", validateParams(RedirectUrlSchema), validateSlugParam, redirectUrl);

export { linksRouter };
