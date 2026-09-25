import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { json, urlencoded } from "body-parser";
import ticketRouter from "./routes/ticket-route";
import articleRouter from "./routes/article-route";
import userRouter from "./routes/user-route";
import customerRouter from "./routes/customer-route";
import dashboardRouter from "./routes/dashboard-route";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
    })
  );
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/article", articleRouter);
  app.use("/ticket", ticketRouter);
  app.use("/user", userRouter);
  app.use("/customer", customerRouter);
  app.use("/dashboard", dashboardRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
