export interface JsonRpcRequest {
  id: number | string | null;
  method: "mining.subscribe" | "mining.authorize" | string;
  params: unknown[];
}

export interface JsonRpcResponse {
  id: number | string | null;
  result: unknown;
  error: string | null;
}

export type MiningSubscribeParams = [];

export type MiningAuthorizeParams = [workerName: string, sessionToken: string];

export interface WorkerRecord {
  workerName: string;
  wallet: string;
  plan: string;
  connectedAt: string;
  authorized: boolean;
}

export interface SessionPayload {
  sub: string;
  wallet: string;
  plan: string;
  iat: number;
  exp: number;
}
