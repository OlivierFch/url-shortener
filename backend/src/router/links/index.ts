import { Router } from "express";
import { handlePostLink } from "./handler/handler.js";

const linksRouter = Router();

linksRouter.post("/", handlePostLink);
// TODO
linksRouter.get("/", (_req, res) => {
    res.send({ message: "Links endpoint" });
});

export { linksRouter };
