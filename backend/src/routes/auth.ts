import { Router } from "express";

import { config } from "../config";
import {
  consumeChallenge,
  createChallenge,
  getChallenge,
} from "../services/challenge";
import { issueSessionToken } from "../services/session";
import { verifyMockSignature } from "../services/signature";
import { AuthRequestChallengeBody, AuthVerifyBody } from "../types";

const router = Router();

router.post("/request-challenge", (req, res) => {
  const { wallet } = req.body as Partial<AuthRequestChallengeBody>;

  if (typeof wallet !== "string" || wallet.trim() === "") {
    return res.status(400).json({ error: "wallet is required and must be a string" });
  }

  const challenge = createChallenge(wallet.trim());

  return res.json({
    challengeId: challenge.id,
    wallet: challenge.wallet,
    message: challenge.message,
    expiresAt: challenge.expiresAt,
  });
});

router.post("/verify", (req, res) => {
  const { wallet, challengeId, signature } = req.body as Partial<AuthVerifyBody>;

  if (
    typeof wallet !== "string" ||
    wallet.trim() === "" ||
    typeof challengeId !== "string" ||
    challengeId.trim() === "" ||
    typeof signature !== "string" ||
    signature.trim() === ""
  ) {
    return res.status(400).json({
      error: "wallet, challengeId, and signature are required and must be strings",
    });
  }

  const normalizedWallet = wallet.trim();
  const normalizedChallengeId = challengeId.trim();
  const challenge = getChallenge(normalizedChallengeId);

  if (!challenge) {
    return res.status(400).json({ error: "challenge not found or expired" });
  }

  if (challenge.used) {
    return res.status(400).json({ error: "challenge already used" });
  }

  if (new Date(challenge.expiresAt).getTime() <= Date.now()) {
    return res.status(400).json({ error: "challenge expired" });
  }

  if (challenge.wallet !== normalizedWallet) {
    return res.status(400).json({ error: "wallet does not match challenge" });
  }

  const isValid = verifyMockSignature({
    wallet: normalizedWallet,
    challengeId: normalizedChallengeId,
    signature: signature.trim(),
  });

  if (!isValid) {
    return res.status(400).json({ error: "invalid signature" });
  }

  consumeChallenge(normalizedChallengeId);

  const sessionToken = issueSessionToken({
    wallet: normalizedWallet,
    plan: "prototype",
  });

  return res.json({
    sessionToken,
    tokenType: "Bearer",
    expiresIn: config.SESSION_TTL_SECONDS,
    plan: "prototype",
  });
});

export default router;
