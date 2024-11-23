import Redis from "ioredis";

const redis = new Redis();

export async function loadUserState(userId) {
  const keys = [
    `user:${userId}:steps`,
    `user:${userId}:message`,
    `user:${userId}:language`,
  ];
  const [steps, messageId, language] = await redis.mget(keys);
  return {
    steps: steps ? JSON.parse(steps) : null,
    messageId: messageId ? parseInt(messageId, 10) : null,
    language: language || "en",
  };
}

export async function saveUserState(userId, { steps, messageId, language }) {
  const pipeline = redis.pipeline();
  if (steps !== undefined) {
    if (steps) {
      pipeline.set(`user:${userId}:steps`, JSON.stringify(steps));
    } else {
      pipeline.del(`user:${userId}:steps`);
    }
  }
  if (messageId !== undefined) {
    if (messageId) {
      pipeline.set(`user:${userId}:message`, messageId.toString());
    } else {
      pipeline.del(`user:${userId}:message`);
    }
  }
  if (language) {
    pipeline.set(`user:${userId}:language`, language);
  }
  await pipeline.exec();
}

export async function deleteUserState(userId) {
  const keys = [
    `user:${userId}:steps`,
    `user:${userId}:message`,
    `user:${userId}:language`,
  ];
  await redis.del(keys);
}

export function getRedisClient() {
  return redis;
}
