import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { env } from "./env.js";
import { healthcheckRouter } from "./router/healthcheck/index.js";
import { linksRouter } from "./router/links/index.js";
import { notFound } from "./router/middlewares/not-found/not-found.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({ origin: env.CORS_ORIGIN ?? "http://localhost:5173" }));

app.use("/health", healthcheckRouter);
app.use("/", linksRouter);

app.use(notFound);

app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});