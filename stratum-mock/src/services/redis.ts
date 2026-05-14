import { createClient } from "redis";

import { config } from "../config";

type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let connectPromise: Promise<RedisClient> | null = null;

const createRedisSingleton = (): RedisClient => {
  const client = createClient({
    url: config.REDIS_URL,
  });

  client.on("error", (error) => {
    console.error(
      `Redis client error (Stratum Gateway mock, ${config.REDIS_URL}): ${error.message}`,
    );
  });

  client.on("reconnecting", () => {
    console.warn(
      `Redis reconnecting for Stratum Gateway mock revocation cache: ${config.REDIS_URL}`,
    );
  });

  return client;
};

export const getRedisClient = (): RedisClient => {
  if (!redisClient) {
    redisClient = createRedisSingleton();
  }

  return redisClient;
};

export const connectRedis = async (): Promise<RedisClient> => {
  const client = getRedisClient();

  if (client.isOpen) {
    return client;
  }

  if (!connectPromise) {
    connectPromise = client
      .connect()
      .then(() => {
        console.log(
          `Redis connected for Stratum Gateway mock revocation cache: ${config.REDIS_URL}`,
        );
        return client;
      })
      .catch((error: Error) => {
        connectPromise = null;
        console.error(
          `Redis connection failed for Stratum Gateway mock revocation cache (${config.REDIS_URL}): ${error.message}`,
        );
        throw error;
      });
  }

  return connectPromise;
};
