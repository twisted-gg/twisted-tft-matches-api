import * as utils from './match.utils'
import { Regions } from 'twisted/dist/constants'
import { InternalServerErrorException } from '@nestjs/common'

describe('Tft match utils', () => {
  describe('Get search params', () => {
    const summonerName = 'hide on bush'
    const region = Regions.KOREA
    it('should return a valid search params', () => {
      const limit = 10
      const page = 0
      const params = {
        limit,
        page,
        summonerName,
        region
      }
      const id = '123'
      const response = utils.getSearchParams(params, id)

      expect(response.skip).toEqual(limit * page)
      expect(response.requestLimit).toEqual((limit * page) + limit)
    })
  })

  describe('Parse participants ids', () => {
    it('should return ids listing', () => {
      const users = [
        {
          _id: '1'
        },
        {
          _id: '2'
        }
      ]
      const response = utils.parseParticipantsIds(users)
      expect(response).toEqual(['1', '2'])
    })

    it('should return empty array', () => {
      const users = []
      const response = utils.parseParticipantsIds(users)
      expect(response).toEqual([])
    })
  })

  describe('Get summoner', () => {
    const puuid = '123'
    it('should return a valid summoner instance', () => {
      const users = [
        {
          puuid,
          name: 'testing'
        },
        {
          puuid: '1233',
          name: 'aa'
        }
      ]
      const summoner = utils.getSummonerID(puuid, users)
      expect(summoner).toBeDefined()
      expect(summoner.name).toEqual('testing')
    })

    it('should throw error when user find has failed', () => {
      const users = [
        {
          puuid: '1232',
          name: 'testing'
        },
        {
          puuid: '1233',
          name: 'aa'
        }
      ]
      expect(() => utils.getSummonerID(puuid, users)).toThrowError(InternalServerErrorException)
    })
  })

  describe('Get match items', () => {
    const items = [
      {
        id: 1,
        name: 'filo'
      },
      {
        id: 2,
        name: 'test'
      }
    ]
    const response = utils.matchItems([1], items)
    expect(response.length).toEqual(1)
    expect(response[0].name).toEqual('filo')
  })
})
