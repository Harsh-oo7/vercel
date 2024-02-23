import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export async function getRedisConnection() {
  const client = new Redis(process.env.REDIS_URL as string);

  return client;
}
