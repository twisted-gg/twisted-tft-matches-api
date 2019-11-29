import { config } from 'dotenv'

config()

export default {
  app: {
    acceptanceHost: process.env.ACCEPTANCE_HOST
  },
  riot: {
    apiKey: process.env.RIOT_API_KEY,
    rateLimitRetry: process.env.RIOT_RATE_LIMIT_RETRY,
    rateLimitCount: process.env.RIOT_RATE_LIMIT_COUNT,
    concurrency: process.env.RIOT_CONCURRENCY,
    debug: {
      url: process.env.RIOT_DEBUG_URL,
      rateLimits: process.env.RIOT_DEBUG_RATELIMITS
    }
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dbname: process.env.DATABASE_DBNAME,
    adminAuth: process.env.DATABASE_ADMIN
  },
  services: {
    static: process.env.STATIC_SERVICE,
    summoners: process.env.SUMMONERS_SERVICE
  },
  concurrency: {
    tft_matches: 1
  },
  redis: {
    enable: process.env.REDIS_ENABLE,
    url: process.env.REDIS_URL
  }
}
