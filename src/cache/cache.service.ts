import { Injectable } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import { CacheTimes } from '../enums/cache.enum'
import { CacheServiceCommon } from '@twisted.gg/common'

const config = new ConfigService()
const available = config.getBoolean('redis.enable')
const url = config.get<string>('redis.url')

@Injectable()
export class CacheService extends CacheServiceCommon {
  constructor () {
    super({
      expiration: CacheTimes.DEFAULT,
      available,
      url
    })
  }
}
