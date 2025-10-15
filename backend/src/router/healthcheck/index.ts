import { Router } from "express";

const healthcheckRouter = Router();

healthcheckRouter.get("/", (_req, res) => {
    res.send({ message: "Url shortener API is online", version: process.env.npm_package_version });
});

export { healthcheckRouter };