import "@prisma/client";

const { JWT_SECRET: ENV_JWT_SECRET, REDIS_URL: ENV_REDIS_URL } = process.env;

if (!ENV_JWT_SECRET)
  throw new Error("JWT_SECRET environment variable is not configured");

export const JWT_SECRET = ENV_JWT_SECRET;

export const BLACKLIST_REDIS_VALUE = "1";

export const REDIS_URL = ENV_REDIS_URL ?? "redis://localhost:6379";
