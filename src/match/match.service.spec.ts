import { Test, TestingModule } from '@nestjs/testing'
import { MatchService } from './match.service'
import { ConfigModule } from '../config/config.module'
import { SummonerService } from '../summoner/summoner.service'
import { ProfileTftStatsService } from '../profile-stats/profile-tft-stats.service'
import { SummonerLeaguesService } from '../summoner-leagues/summoner-leagues.service'
import { DatabaseTestProviders } from '../database/database.providers'
import { RiotApiService } from '../riot-api/riot-api.service'
import { StaticDataService } from '../static-data/static-data.service'
import { stub, restore } from 'sinon'
import { Regions } from 'twisted/dist/constants'

describe('TftMatchService', () => {
  let service: any & MatchService
  let module: TestingModule
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule
      ],
      providers: [
        ...DatabaseTestProviders,
        StaticDataService,
        RiotApiService,
        ProfileTftStatsService,
        SummonerLeaguesService,
        SummonerService,
        MatchService
      ]
    }).compile()
    service = module.get<MatchService>(MatchService)
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Match', () => {
    beforeEach(() => {
      restore()
    })
    it('should return valid match instance', async () => {
      const match = { matchId: 1 }
      stub(service.api, 'get')
        .onFirstCall()
        .returns(Promise.resolve({ response: { match } }))
      const response = await service.getMatch()
      expect(response).toEqual({ match })
    })

    it('should return summoners mappers', async () => {
      const user = {
        user: 'hide on bush'
      }
      stub(service.summonerService, 'get')
        .onFirstCall()
        .returns(Promise.resolve(user))
      const currentPuuid = 'id'
      const puuids = [1]
      const mapUsers = await service.matchSummoners(currentPuuid, puuids)
      expect(mapUsers).toEqual([user])
    })

    describe('Create match', () => {
      beforeEach(() => {
        restore()
      })

      it('should return a valid match listing', async () => {
        const list = [0, 1, 2]
        stub(service.api, 'list')
          .callsFake(() => Promise.resolve({ response: list }))

        const response = await service.getMatchListing()
        expect(response).toEqual(list)
      })
    })
  })

  describe('Summoner', () => {
    beforeEach(() => {
      restore()
    })
    describe('Update', () => {
      it('should return a valid user updated data', async () => {
        stub(service.summonerService, 'get')
          .callsFake(() => Promise.resolve({ puuid: 1 }))

        stub(service, 'getMatchListing')
          .callsFake(() => Promise.resolve([1, 2, 3]))

        stub(service, 'createMatch')
          .callsFake((_, match) => Promise.resolve({ match }))

        const response = await service.updateSummoner({ region: Regions.AMERICA_NORTH })
        expect(response).toEqual({ msg: 'OK' })
      })
    })

    describe('Matches listing', () => {
      it('should return empty array when limit is greater than results', async () => {
        stub(service.summonerService, 'get')
          .callsFake(() => Promise.resolve({ _id: 1 }))

        stub(service.repository, 'countDocuments')
          .callsFake(() => Promise.resolve(1))

        const { data } = await service.getBySummoner({ limit: 1, page: 2 })
        expect(data).toEqual([])
      })

      it('should return valid array when limit is lower than results', async () => {
        const matches = [1, 2]
        stub(service.summonerService, 'get')
          .callsFake(() => Promise.resolve({ _id: 1 }))

        stub(service.repository, 'countDocuments')
          .callsFake(() => Promise.resolve(10))

        stub(service.repository, 'find')
          .callsFake(() => ({
            limit: () => ({
              skip: () => ({
                sort: () => Promise.resolve(matches)
              })
            })
          }))

        const { data } = await service.getBySummoner({ limit: 1, page: 2 })
        expect(data).toEqual(matches)
      })
    })
  })
})
