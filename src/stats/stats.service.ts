import { Injectable } from '@nestjs/common'
import * as algorithms from './algorithms'
import * as utils from './stats.utils'
import { Model } from 'mongoose'
import { ITftSummonerStatsModel, ITFTMatchModel } from '@twisted.gg/models'
import { SummonersService } from '../summoners/summoners.service'
import { ModelsName } from '@twisted.gg/models/dist/enum/collections.enum'
import { InjectModel } from '@nestjs/mongoose'
import { TftMatchStatsEnum, LimitsEnum } from '../enums/app.enum'
import { GetSummonerQueryDTO } from '@twisted.gg/common'
import { GetProfileTftStats } from '../models/stats/summoner.dto'

@Injectable()
export class StatsService {
  constructor (
    // Database
    @InjectModel(ModelsName.TFT_SUMMONER_STATS) private readonly repository: Model<ITftSummonerStatsModel>,
    @InjectModel(ModelsName.TFT_MATCH) private readonly tftRepository: Model<ITFTMatchModel>,

    // Services
    private readonly summonerService: SummonersService
  ) {}

  private async upsert (condition: any, instance: any) {
    return this.repository.updateOne(condition, instance, { upsert: true })
  }

  private async matchStatsByQueue (
    name: string,
    summoner: string,
    puuid: string,
    matches: Partial<ITFTMatchModel>[],
    queues: number[],
    conditional?: string
  ) {
    for (const queue of queues) {
      const matchesByQueue = matches.filter(match => match.queue && match.queue.queueId === +queue)
      const stats = utils.ObjectResponse(puuid, matchesByQueue)
      const condition = {
        name,
        queue,
        summoner,
        conditional
      }
      const instance = {
        ...condition,
        ...stats
      }
      await this.upsert(condition, instance)
    }
  }

  private async traits (summoner: string, puuid: string, matches: ITFTMatchModel[], queues: number[]) {
    const traits = algorithms.getTraits(puuid, matches)
    for (const trait of traits) {
      const matchFilter = utils.FilterByTrait(trait, puuid, matches)
      await this.matchStatsByQueue(
        TftMatchStatsEnum.BY_TRAIT,
        summoner,
        puuid,
        matchFilter,
        queues,
        trait
      )
    }
  }

  private async items (summoner: string, puuid: string, matches: ITFTMatchModel[], queues: number[]) {
    const items = algorithms.getItems(puuid, matches)
    for (const item of items) {
      const matchFilter = utils.FilterByItem(item.id, puuid, matches)
      await this.matchStatsByQueue(
        TftMatchStatsEnum.BY_ITEMS,
        summoner,
        puuid,
        matchFilter,
        queues,
        String(item.id)
      )
    }
  }

  private globalStats (summoner: string, puuid: string, matches: ITFTMatchModel[]) {
    const stats = utils.ObjectResponse(puuid, matches)
    const globalQueue = 0
    const condition = {
      name: TftMatchStatsEnum.GLOBAL_STATS,
      queue: globalQueue,
      summoner
    }
    const instance = {
      ...condition,
      ...stats
    }
    return this.upsert(condition, instance)
  }

  async updateSummoner (params: GetSummonerQueryDTO) {
    const { _id, puuid } = await this.summonerService.get(params.summonerName, params.region, params.summonerPUUID)
    const matchHistory = await this.tftRepository.find({
      participantsIds: _id
    })
    if (!Array.isArray(matchHistory) || matchHistory.length < LimitsEnum.MIN_MATCHES_TO_STATS) {
      return
    }
    const queues = algorithms.getQueues(matchHistory)

    await this.matchStatsByQueue(TftMatchStatsEnum.BY_QUEUES, _id, puuid, matchHistory, queues)
    await this.globalStats(_id, puuid, matchHistory)
    await this.traits(_id, puuid, matchHistory, queues)
    await this.items(_id, puuid, matchHistory, queues)
  }

  async get (params: GetProfileTftStats) {
    const { _id } = await this.summonerService.get(params.summonerName, params.region, params.summonerPUUID)
    const options = utils.FindOptions(_id, params)
    return this.repository.find(options)
  }
}
