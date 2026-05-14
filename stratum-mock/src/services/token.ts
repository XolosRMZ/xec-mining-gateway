import jwt from "jsonwebtoken";

import { config } from "../config";
import { SessionPayload } from "../types";

// This mock validates JWTs locally only. It cannot see backend in-memory revocations.
// Production needs shared revocation storage or a centralized validation cache.
export const verifySessionToken = (token: string): SessionPayload | null => {
  if (!token) {
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
