import { Injectable } from '@nestjs/common'
import { LolApi, TftApi } from 'twisted'
import { ConfigService } from '../config/config.service'

@Injectable()
export class RiotApiService {
  private readonly lolApi: LolApi
  private readonly tftApi: TftApi

  constructor (
    private readonly config: ConfigService
  ) {
    const params = {
      key: this.config.get<string>('riot.apiKey'),
      rateLimitRetry: this.config.getBoolean('riot.rateLimitRetry'),
      rateLimitRetryAttempts: this.config.getNumber('riot.rateLimitCount'),
      concurrency: +this.config.getNumber('riot.concurrency'),
      debug: {
        logUrls: this.config.getBoolean('riot.debug.url'),
        logRatelimits: this.config.getBoolean('riot.debug.rateLimits')
      }
    }
    this.lolApi = new LolApi(params)
    this.tftApi = new TftApi(params)
  }

  getTftApi (): TftApi {
    return this.tftApi
  }

  getLolApi (): LolApi {
    return this.lolApi
  }
}
