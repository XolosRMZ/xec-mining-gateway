import net from "node:net";

import { config } from "./config";
import { verifySessionToken } from "./services/token";
import { registerWorker } from "./services/workerRegistry";
import { JsonRpcRequest, JsonRpcResponse, MiningAuthorizeParams } from "./types";

const respond = (socket: net.Socket, response: JsonRpcResponse): void => {
  socket.write(`${JSON.stringify(response)}\n`);
};

const isJsonRpcRequest = (value: unknown): value is JsonRpcRequest => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<JsonRpcRequest>;

  return (
    "method" in candidate &&
    typeof candidate.method === "string" &&
    Array.isArray(candidate.params)
  );
};

const handleSubscribe = (socket: net.Socket, request: JsonRpcRequest): void => {
  respond(socket, {
    id: request.id,
    result: [
      [
        ["mining.set_difficulty", "1"],
        ["mining.notify", "1"],
      ],
      "prototype-session",
      4,
    ],
    error: null,
  });
};

const handleAuthorize = (socket: net.Socket, request: JsonRpcRequest): void => {
  const [workerName, sessionToken] = request.params as MiningAuthorizeParams;

  if (typeof workerName !== "string" || typeof sessionToken !== "string") {
    respond(socket, {
      id: request.id,
      result: false,
      error: "Invalid authorize params",
    });
    return;
  }

  const session = verifySessionToken(sessionToken);

  if (!session) {
    respond(socket, {
      id: request.id,
      result: false,
      error: "Invalid or expired session token",
    });
    return;
  }

  const worker = registerWorker(workerName, session.wallet, session.plan);

  console.log(
    `Authorized worker=${worker.workerName} wallet=${worker.wallet} plan=${worker.plan}`,
  );

  respond(socket, {
    id: request.id,
    result: true,
    error: null,
  });
};

const server = net.createServer((socket) => {
  const remote = `${socket.remoteAddress ?? "unknown"}:${socket.remotePort ?? "unknown"}`;

  console.log(`Client connected from ${remote}`);

  let buffer = "";

  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8");

    let newlineIndex = buffer.indexOf("\n");

    while (newlineIndex >= 0) {
      const rawMessage = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (rawMessage.length > 0) {
        try {
          const parsed = JSON.parse(rawMessage) as unknown;

          if (!isJsonRpcRequest(parsed)) {
            respond(socket, {
              id: null,
              result: null,
              error: "Invalid JSON-RPC request",
            });
          } else if (parsed.method === "mining.subscribe") {
            handleSubscribe(socket, parsed);
          } else if (parsed.method === "mining.authorize") {
            handleAuthorize(socket, parsed);
          } else {
            respond(socket, {
              id: parsed.id ?? null,
              result: null,
              error: "Unsupported method",
            });
          }
        } catch {
          respond(socket, {
            id: null,
            result: null,
            error: "Invalid JSON",
          });
        }
      }

      newlineIndex = buffer.indexOf("\n");
    }
  });

  socket.on("close", () => {
    console.log(`Client disconnected from ${remote}`);
  });

  socket.on("error", (error) => {
    console.error(`Socket error from ${remote}:`, error.message);
  });
});

server.on("error", (error) => {
  console.error("Stratum mock server error:", error.message);
});

server.listen(config.STRATUM_PORT, config.STRATUM_HOST, () => {
  console.log(
    `Stratum mock server listening on ${config.STRATUM_HOST}:${config.STRATUM_PORT}`,
  );
  console.log(
    "Local JWT validation only. Production needs shared revocation storage or centralized validation cache.",
  );
});
