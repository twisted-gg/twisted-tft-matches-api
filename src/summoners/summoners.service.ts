import { Injectable } from '@nestjs/common'
import { ConfigService } from '../config/config.service'
import * as rp from 'request-promise'
import * as requestUtils from '../requests/requests.utils'
import { Regions } from '@twisted.gg/common/dist/wrapper/constants'
import { GetSummonerLeaguesDTO } from '@twisted.gg/models'

@Injectable()
export class SummonersService {
  private readonly uri = this.config.get<string>('services.summoners')

  constructor (
    private readonly config: ConfigService
  ) {}

  async get (summonerName: string, region: Regions, summonerPUUID?: string) {
    const options: rp.OptionsWithUri = {
      uri: '',
      qs: {
        summonerName,
        summonerPUUID,
        region
      }
    }
    return requestUtils.request(options, this.uri)
  }
}
