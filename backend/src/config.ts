import dotenv from "dotenv";

dotenv.config();

const MEMBERSHIP_MODES = ["mock", "chronik"] as const;

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const parseBigInt = (value: string | undefined, fallback: bigint): bigint => {
  if (typeof value !== "string" || value.trim() === "") {
    return fallback;
  }

  try {
    const parsed = BigInt(value.trim());
    return parsed >= 0n ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const parseMembershipMode = (
  value: string | undefined,
): (typeof MEMBERSHIP_MODES)[number] => {
  if (typeof value !== "string") {
    return "mock";
  }

  const normalized = value.trim().toLowerCase();

  return MEMBERSHIP_MODES.includes(normalized as "mock" | "chronik")
    ? (normalized as "mock" | "chronik")
    : "mock";
};

const parseChronikUrls = (value: string | undefined): string[] => {
  const rawValue = value ?? "https://chronik.xolosarmy.xyz";

  return rawValue
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
};

export const config = {
  PORT: parseNumber(process.env.PORT, 3001),
  // Local development fallback only. Production must provide a strong secret.
  SESSION_SECRET:
    process.env.SESSION_SECRET ?? "local-development-only-membership-gateway-secret",
  SESSION_TTL_SECONDS: parseNumber(process.env.SESSION_TTL_SECONDS, 86400),
  CHALLENGE_TTL_SECONDS: parseNumber(process.env.CHALLENGE_TTL_SECONDS, 300),
  MEMBERSHIP_MODE: parseMembershipMode(process.env.MEMBERSHIP_MODE),
  CHRONIK_URLS: parseChronikUrls(process.env.CHRONIK_URLS),
  RMZ_TOKEN_ID:
    process.env.RMZ_TOKEN_ID ??
    "c923bd0f09c630c5e9980cf518c8d34b6353802a3cb7c3f34fa7cc85c9305908",
  // 10000 atoms = 1 RMZ if RMZ has 4 decimals.
  // Production target may be 25000000 atoms = 2500 RMZ.
  MIN_RMZ_ATOMS_REQUIRED: parseBigInt(
    process.env.MIN_RMZ_ATOMS_REQUIRED,
    10000n,
  ),
} as const;
