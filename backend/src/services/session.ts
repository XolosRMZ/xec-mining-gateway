import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { config } from "../config";
import { MembershipTier, SessionPayload } from "../types";

const revokedTokens = new Set<string>();

interface IssueSessionTokenParams {
  wallet: string;
  plan?: MembershipTier;
}

export const issueSessionToken = ({
  wallet,
  plan = "base",
}: IssueSessionTokenParams): string => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + config.SESSION_TTL_SECONDS;

  const payload: SessionPayload = {
    sub: uuidv4(),
    wallet,
    plan,
    iat: issuedAt,
    exp: expiresAt,
  };

  return jwt.sign(payload, config.SESSION_SECRET);
};

export const verifySessionToken = (token: string): SessionPayload | null => {
  if (isTokenRevoked(token)) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, config.SESSION_SECRET) as SessionPayload;

    if (
      typeof decoded.sub !== "string" ||
      typeof decoded.wallet !== "string" ||
      typeof decoded.plan !== "string" ||
      typeof decoded.iat !== "number" ||
      typeof decoded.exp !== "number"
    ) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};

export const revokeSessionToken = (token: string): void => {
  revokedTokens.add(token);
};

export const isTokenRevoked = (token: string): boolean => revokedTokens.has(token);
