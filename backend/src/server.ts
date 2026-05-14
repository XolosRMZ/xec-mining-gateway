import cors from "cors";
import express from "express";
import helmet from "helmet";

import { config } from "./config";
import authRoutes from "./routes/auth";
import { closeRedis } from "./services/redis";
import sessionRoutes from "./routes/session";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "xec-mining-gateway",
    phase: "membership-gateway-prototype",
    docs: "https://github.com/xolosArmy/xec-mining-gateway",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "xec-mining-gateway-membership-prototype",
  });
});

app.use("/v1/auth", authRoutes);
app.use("/v1/session", sessionRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "not found" });
});

const server = app.listen(config.PORT, () => {
  console.log(
    `xec-mining-gateway membership prototype listening on port ${config.PORT}`
  );
});

const shutdown = async (): Promise<void> => {
  await closeRedis();
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});
