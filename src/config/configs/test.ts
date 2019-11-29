import { config } from 'dotenv'
config()

export default {
  riot: {
    apiKey: 'API KEY',
    rateLimitRetry: true,
    rateLimitCount: 1
  }
}
