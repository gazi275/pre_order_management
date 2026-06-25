import redis from "../../../shared/redis";
import crypto from "crypto";

const SINGLE_PREFIX = "preorder:single:";
const LIST_PREFIX = "preorder:list:";
const DEFAULT_TTL = 3600; // 1 hour in seconds

/**
 * Build a deterministic cache key from query filters and pagination options.
 * Uses MD5 hash of the sorted JSON to keep key length short.
 */
const buildListKey = (filters: Record<string, any>, options: Record<string, any>): string => {
  const raw = JSON.stringify({ filters, options }, Object.keys({ filters, options }).sort());
  const hash = crypto.createHash("md5").update(raw).digest("hex");
  return `${LIST_PREFIX}${hash}`;
};

/**
 * Get a single preorder from cache by ID.
 */
const getCachedSingle = async (id: string) => {
  const cached = await redis.get(`${SINGLE_PREFIX}${id}`);
  if (!cached) return null;
  return JSON.parse(cached);
};

/**
 * Cache a single preorder by ID.
 */
const setCachedSingle = async (id: string, data: any): Promise<void> => {
  await redis.set(`${SINGLE_PREFIX}${id}`, JSON.stringify(data), "EX", DEFAULT_TTL);
};

/**
 * Delete a single preorder's cache.
 */
const invalidateSingle = async (id: string): Promise<void> => {
  await redis.del(`${SINGLE_PREFIX}${id}`);
};

/**
 * Get a cached list response by its query key.
 */
const getCachedList = async (key: string) => {
  const cached = await redis.get(key);
  if (!cached) return null;
  return JSON.parse(cached);
};

/**
 * Cache a list response with its query key.
 */
const setCachedList = async (key: string, data: any): Promise<void> => {
  await redis.set(key, JSON.stringify(data), "EX", DEFAULT_TTL);
};

/**
 * Invalidate all list caches using non-blocking SCAN.
 * This is safe for production — unlike KEYS, SCAN does not block the Redis server.
 */
const invalidateAllLists = async (): Promise<void> => {
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redis.scan(cursor, "MATCH", `${LIST_PREFIX}*`, "COUNT", 100);
    cursor = nextCursor;
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== "0");
};

/**
 * Invalidate everything related to a mutation:
 * - The specific single-preorder cache
 * - All list caches (since any mutation can affect paginated/filtered results)
 */
const invalidateOnMutation = async (id?: string): Promise<void> => {
  const tasks: Promise<void>[] = [invalidateAllLists()];
  if (id) {
    tasks.push(invalidateSingle(id));
  }
  await Promise.all(tasks);
};

export const PreorderCache = {
  buildListKey,
  getCachedSingle,
  setCachedSingle,
  invalidateSingle,
  getCachedList,
  setCachedList,
  invalidateAllLists,
  invalidateOnMutation,
};
