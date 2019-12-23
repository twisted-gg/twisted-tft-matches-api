import { Injectable, BadGatewayException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Promise } from 'bluebird'
import { Regions, regionToTftRegions, TftRegions } from '@twisted.gg/common/dist/wrapper/constants'
import { RiotApiService } from '../riot-api/riot-api.service'
import * as tftMatchUtils from './match.utils'
import * as _ from 'lodash'
import { ConfigService } from '../config/config.service'
import { StaticDataService } from '../static-data/static-data.service'
import { QueryTftMatches } from '../models/match/dto/query.tft-match.dto'
import { Cache } from '../cache/cache.decorator'
import { CacheTimes } from '../enums/cache.enum'
import { UpdateSummonerTFTMatchDTO } from '../models/match/dto/update-summoner.tft-match.dto'
import { TotalTFTMatchesDTO } from '../models/match/dto/total.tft-match.dto'
import { ITFTMatchModel, ISummonerModel, StaticTftItemsDTO, QueueDTO, GetSummonerQueryDTO } from '@twisted.gg/models'
import { SummonersService } from '../summoners/summoners.service'
import { ModelsName } from '@twisted.gg/models/dist/enum/collections.enum'
import { StatsService } from '../stats/stats.service'
import { GetProfileTftStats } from '../models/stats/summoner.dto'

@Injectable()
export class MatchService {
  private readonly api = this.riot.getTftApi().Match
  private readonly concurrency = this.config.getNumber('concurrency.tft_matches')

  constructor (
    @InjectModel(ModelsName.TFT_MATCH) private readonly repository: Model<ITFTMatchModel>,

    private readonly config: ConfigService,
    private readonly summonerService: SummonersService,
    private readonly staticService: StaticDataService,
    private readonly statsService: StatsService,
    private readonly riot: RiotApiService
  ) {}

  // Internal methods
  private async matchSummoners (currentPuuid: string, puuids: string[], region: Regions): Promise<ISummonerModel[]> {
    const response: ISummonerModel[] = []
    for (const puuid of puuids) {
      const summoner = await this.summonerService.get('', region, puuid)
      response.push(summoner)
    }
    return response
  }

  @Cache({
    expiration: CacheTimes.TFT_MATCH_DETAILS
  })
  private async getMatch (match_id: string, region: TftRegions) {
    const {
      response: match
    } = await this.api.get(match_id, region)
    return match
  }

  private async createMatch (puuid: string, match_id: string, region: Regions) {
    // Exists
    const exists = await this.repository.exists({ match_id, region })
    if (exists) {
      // return []
    }
    const parseRegion = regionToTftRegions(region)
    const match = await this.getMatch(match_id, parseRegion)
    // Match users
    const users = await this.matchSummoners(puuid, match.metadata.participants, region)
    const queue = await this.staticService.queues(match.info.queue_id)
    const items: StaticTftItemsDTO[] = await this.staticService.items()
    const model = tftMatchUtils.riotToModel(match, region, users, queue, items)
    if (!model.match_id) {
      throw new BadGatewayException('Invalid match id')
    }
    // Create game
    const condition = {
      match_id: model.match_id,
      region: model.region
    }
    const options = {
      upsert: true
    }
    await this.repository.updateOne(condition, model, options)

    return users
  }

  @Cache({
    expiration: CacheTimes.TFT_MATCH_LISTING
  })
  private async getMatchListing (puuid: string, region: TftRegions) {
    const {
      response: matchIds
    } = await this.api.list(puuid, region)
    return matchIds
  }

  private async summonerStats (summoners: string[], region: Regions) {
    await Promise.all(summoners.map((summoner) => {
      const query: GetSummonerQueryDTO = {
        summonerName: '',
        summonerPUUID: summoner,
        region
      }
      return this.statsService.updateSummoner(query)
    }))
  }

  private mapUsers (previous: string[], current: ISummonerModel[]) {
    current = _.castArray(current)
    for (const summoner of current) {
      const id = summoner.puuid
      if (previous.indexOf(id) === -1) {
        previous.push(id)
      }
    }
    return previous
  }

  // Public methods
  async updateStats (params: GetSummonerQueryDTO): Promise<UpdateSummonerTFTMatchDTO> {
    const parseRegion = regionToTftRegions(params.region)
    // Summoner details
    const { puuid } = await this.summonerService.get(params.summonerName, params.region)
    // Create matches
    const users = await Promise.map(
      this.getMatchListing(puuid, parseRegion),
      match => this.createMatch(puuid, match, params.region),
      { concurrency: this.concurrency }
    )
      .reduce(this.mapUsers, [])
    // Update summoners stats
    this.summonerStats(users, params.region)
    // Response
    return { msg: 'OK' }
  }

  async getBySummoner (params: QueryTftMatches) {
    // Search params
    const { _id } = await this.summonerService.get(params.summonerName, params.region)
    const {
      condition,
      skip,
      sort,
      requestLimit
    } = tftMatchUtils.getSearchParams(params, _id)

    const count = await this.repository.countDocuments(condition)
    const baseObjectResponse = {
      page: params.page,
      limit: params.limit,
      total: count,
      data: []
    }

    // Page results isn't greater than total results
    const roundCount = Math.ceil(count / params.limit) * params.limit
    if (roundCount >= requestLimit) {
      const data = await this.repository.find(condition)
        .limit(params.limit)
        .skip(skip)
        .sort(sort)
      const dataParsed = tftMatchUtils.matchesBySummoner(_id, data)
      return {
        ...baseObjectResponse,
        data: dataParsed
      }
    }
    return baseObjectResponse
  }

  async getSummonerStats (params: GetProfileTftStats) {
    return this.statsService.get(params)
  }

  async total (): Promise<TotalTFTMatchesDTO> {
    const matches = await this.repository.find()
    const size = JSON.stringify(matches).length
    return {
      count: matches.length,
      size
    }
  }

  async get (_id: string) {
    const match = await this.repository.findOne({ _id })
    if (!match) {
      throw new NotFoundException()
    }
    return match
  }
}
