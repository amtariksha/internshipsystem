import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "@/lib/db/redis";

const limiters = new Map<string, Ratelimit>();
let warnedMissingRedis = false;

export async function checkRateLimit(
  key: string,
  requests: number,
  windowSec: number
): Promise<{ success: boolean }> {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (!warnedMissingRedis) {
      warnedMissingRedis = true;
      console.error(
        "checkRateLimit: UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting disabled (failing open)"
      );
    }
    return { success: true };
  }

  const configKey = `${requests}:${windowSec}`;
  let limiter = limiters.get(configKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(requests, `${windowSec} s`),
      prefix: `ratelimit:${configKey}`,
    });
    limiters.set(configKey, limiter);
  }

  try {
    const { success } = await limiter.limit(key);
    return { success };
  } catch (error) {
    console.error("checkRateLimit: limit check failed, failing open", error);
    return { success: true };
  }
}
