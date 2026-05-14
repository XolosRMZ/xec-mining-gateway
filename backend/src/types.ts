export interface ChallengeRecord {
  id: string;
  wallet: string;
  nonce: string;
  message: string;
  issuedAt: string;
  expiresAt: string;
  used: boolean;
}

export type MembershipTier = "founding-miner" | "base" | "none";

export interface MembershipStatus {
  wallet: string;
  tier: MembershipTier;
  active: boolean;
  source: "mock" | "chronik";
  rmzAtoms?: string;
  rmzRequiredAtoms?: string;
  tokenId?: string;
  error?: string;
}

export interface SessionPayload {
  sub: string;
  wallet: string;
  plan: MembershipTier;
  iat: number;
  exp: number;
}

export interface AuthRequestChallengeBody {
  wallet: string;
}

export interface AuthVerifyBody {
  mode: "mock" | "tonalli";
  wallet: string;
  challengeId: string;
  signature: string;
  publicKey?: string;
}

export interface SessionStatusQuery {
  active: boolean;
  wallet?: string;
  plan?: MembershipTier;
  expiresAt?: string;
}

export interface RevokeSessionBody {
  token?: string;
}
