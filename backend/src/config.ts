import dotenv from "dotenv";

dotenv.config();

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

export const config = {
  PORT: parseNumber(process.env.PORT, 3001),
  // Local development fallback only. Production must provide a strong secret.
  SESSION_SECRET:
    process.env.SESSION_SECRET ?? "local-development-only-membership-gateway-secret",
  SESSION_TTL_SECONDS: parseNumber(process.env.SESSION_TTL_SECONDS, 86400),
  CHALLENGE_TTL_SECONDS: parseNumber(process.env.CHALLENGE_TTL_SECONDS, 300),
} as const;
