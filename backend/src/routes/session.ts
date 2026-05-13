import { Request, Router } from "express";

import {
  revokeSessionToken,
  verifySessionToken,
} from "../services/session";
import { SessionStatusQuery } from "../types";

const router = Router();

const extractBearerToken = (req: Request): string | null => {
  const authorization = req.header("authorization");

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

router.get("/status", (req, res) => {
  const token = extractBearerToken(req);

  if (!token) {
    const response: SessionStatusQuery = { active: false };
    return res.json(response);
  }

  const session = verifySessionToken(token);

  if (!session) {
    const response: SessionStatusQuery = { active: false };
    return res.json(response);
  }

  const response: SessionStatusQuery = {
    active: true,
    wallet: session.wallet,
    plan: session.plan,
    expiresAt: new Date(session.exp * 1000).toISOString(),
  };

  return res.json(response);
});

router.post("/revoke", (req, res) => {
  const token = extractBearerToken(req);

  if (!token) {
    return res.status(401).json({ error: "missing or invalid authorization header" });
  }

  const session = verifySessionToken(token);

  if (!session) {
    return res.status(401).json({ error: "invalid session token" });
  }

  revokeSessionToken(token);

  return res.json({ revoked: true });
});

export default router;
