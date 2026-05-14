export interface ChallengeResponse {
  challengeId: string;
  wallet: string;
  nonce: string;
  message: string;
  issuedAt: string;
  expiresAt: string;
}

export type VerificationMode = "mock" | "tonalli";

export interface VerifyResponse {
  sessionToken: string;
  tokenType: string;
  expiresIn: number;
  plan: string;
}

export interface SessionStatusResponse {
  active: boolean;
  wallet?: string;
  plan?: string;
  expiresAt?: string;
}

export interface ApiError {
  error: string;
  status?: number;
}
