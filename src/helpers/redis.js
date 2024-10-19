"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisStore = exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
// Create Redis client
const redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    // Add any other Redis configuration options here
});
exports.redisClient = redisClient;
const RedisStore = new connect_redis_1.default({
    client: redisClient,
}); // Get RedisStore class
exports.RedisStore = RedisStore;
