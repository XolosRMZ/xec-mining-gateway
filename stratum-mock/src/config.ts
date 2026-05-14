import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

export const config = {
  STRATUM_HOST: process.env.STRATUM_HOST ?? "127.0.0.1",
  STRATUM_PORT: parsePort(process.env.STRATUM_PORT, 3333),
  // Local development fallback only. Production must provide a strong secret.
  // This matches the backend fallback so local JWT validation can work end-to-end.
  SESSION_SECRET:
    process.env.SESSION_SECRET ?? "local-development-only-membership-gateway-secret",
  DEFAULT_WORKER:
    process.env.DEFAULT_WORKER ??
    "ecash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a.worker1",
  SESSION_TOKEN: process.env.SESSION_TOKEN ?? "",
} as const;
