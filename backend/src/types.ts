export interface ChallengeRecord {
  id: string;
  wallet: string;
  nonce: string;
  message: string;
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
  wallet: string;
  challengeId: string;
  signature: string;
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
