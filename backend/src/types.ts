export interface ChallengeRecord {
  id: string;
  wallet: string;
  nonce: string;
  message: string;
  issuedAt: string;
  expiresAt: string;
  used: boolean;
}

export interface SessionPayload {
  sub: string;
  wallet: string;
  plan: string;
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
  plan?: string;
  expiresAt?: string;
}

export interface RevokeSessionBody {
  token?: string;
}
