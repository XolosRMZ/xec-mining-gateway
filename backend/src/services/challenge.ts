import { v4 as uuidv4 } from "uuid";

import { config } from "../config";
import { ChallengeRecord } from "../types";

const challengeStore = new Map<string, ChallengeRecord>();

export const createChallenge = (wallet: string): ChallengeRecord => {
  cleanupExpiredChallenges();

  const id = uuidv4();
  const nonce = uuidv4();
  const expiresAt = new Date(Date.now() + config.CHALLENGE_TTL_SECONDS * 1000).toISOString();
  const message = `eCash México Mining Gateway authentication challenge: ${nonce}`;

  const record: ChallengeRecord = {
    id,
    wallet,
    nonce,
    message,
    expiresAt,
    used: false,
  };

  challengeStore.set(id, record);

  return record;
};

export const getChallenge = (challengeId: string): ChallengeRecord | undefined => {
  cleanupExpiredChallenges();
  return challengeStore.get(challengeId);
};

export const consumeChallenge = (challengeId: string): void => {
  const record = challengeStore.get(challengeId);

  if (!record) {
    return;
  }

  challengeStore.set(challengeId, {
    ...record,
    used: true,
  });
};

export const cleanupExpiredChallenges = (): void => {
  const now = Date.now();

  for (const [id, record] of challengeStore.entries()) {
    if (new Date(record.expiresAt).getTime() <= now) {
      challengeStore.delete(id);
    }
  }
};
