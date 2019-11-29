import { Injectable } from '@nestjs/common'
import * as rp from 'request-promise'
import { ConfigService } from '../config/config.service'
import * as requestUtils from '../requests/requests.utils'

@Injectable()
export class StaticDataService {
  private readonly uri = this.config.get<string>('services.static')

  constructor (
    private readonly config: ConfigService
  ) {}

  async queues (id: number) {
    const path = 'queues'
    const options: rp.OptionsWithUri = {
      uri: path,
      qs: {
        id
      }
    }
    return requestUtils.request(options, this.uri)
  }

  async items (id?: string) {
    const path = 'tft/items'
    const options: rp.OptionsWithUri = {
      uri: path,
      qs: {
        id
      }
    }
    return requestUtils.request(options, this.uri)
  }
}
