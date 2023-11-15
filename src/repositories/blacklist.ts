import { RedisClientType } from "redis";
import { IBlacklistRepository } from ".";
import { BLACKLIST_REDIS_VALUE } from "../utils/const";

export default class BlacklistRepository implements IBlacklistRepository {
  constructor(private client: RedisClientType) {
    this.client = client;
  }

  async addToBlacklist(token: string, exp: number): Promise<void> {
    await this.client.SET(`bl_${token}`, BLACKLIST_REDIS_VALUE);
    await this.client.EXPIREAT(`bl_${token}`, exp);
    return;
  }

  async isAlreadyBlacklisted(token: string): Promise<boolean> {
    const val = await this.client.GET(`b1_${token}`);
    return val === BLACKLIST_REDIS_VALUE;
  }
}
