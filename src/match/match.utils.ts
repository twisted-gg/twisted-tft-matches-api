import { MatchTFTDTO } from 'twisted/dist/dto/Match/Tft/MatchTFT.dto'
import { Regions } from 'twisted/dist/constants'
import { InternalServerErrorException } from '@nestjs/common'
import { QueryTftMatches } from '../models/match/dto/query.tft-match.dto'
import { TftMatchEnum } from '../enums/app.enum'
import { ISummonerModel, TftMatchParticipantsModel, ITFTMatchModel } from 'twisted-models'

function timestampToDate (value: number): Date {
  return new Date(value)
}

export function getSummonerID (puuid: string, users: Partial<ISummonerModel>[]): Partial<ISummonerModel> {
  const summoner = users.find(u => u.puuid === puuid)
  if (!summoner) {
    throw new InternalServerErrorException('Bad summoners match (tft)')
  }
  return summoner
}

export function matchItems (ids: number[], items: any[]) {
  return ids.map(id => items.find(i => i.id === id))
}

export function parseParticipants (match: MatchTFTDTO, users: ISummonerModel[], items: any[]): Partial<TftMatchParticipantsModel>[] {
  const response: Partial<TftMatchParticipantsModel>[] = []
  const {
    info: {
      participants
    }
  } = match
  // Match participants
  for (const participant of participants) {
    // Values
    const {
      placement,
      level,
      last_round,
      time_eliminated,
      players_eliminated = 0,
      puuid,
      total_damage_to_players,
      gold_left,
      traits,
      companion
    } = participant
    const summoner = getSummonerID(puuid, users)
    const units = participant.units.map((unit) => {
      const mapItems = matchItems(unit.items, items)
      return {
        ...unit,
        items: mapItems
      }
    })
    // Set
    const parsedSummoner: Partial<TftMatchParticipantsModel> = {
      placement,
      level,
      last_round,
      time_eliminated,
      players_eliminated,
      puuid,
      total_damage_to_players,
      gold_left,
      traits,
      units,
      companion,
      summoner
    }

    response.push(parsedSummoner)
  }
  return response
}

export function parseParticipantsIds (users: Partial<ISummonerModel>[]) {
  return users.map(u => u._id as string)
}

export function riotToModel (
  match: MatchTFTDTO,
  region: Regions,
  users: ISummonerModel[],
  queue: number,
  items: any[]
  ): Partial<ITFTMatchModel> {
  const { info, metadata } = match
  // Participants match
  const participants = parseParticipants(match, users, items)
  const participantsIds = parseParticipantsIds(users)
  // Match
  return {
    match_id: metadata.match_id,
    data_version: metadata.data_version,
    tft_set_number: info.tft_set_number,
    game_length: info.game_length,
    game_version: info.game_version,
    game_datetime: timestampToDate(info.game_datetime),
    queue,
    participants,
    participantsIds,
    region
  }
}

export function getSearchParams (params: QueryTftMatches, id: string) {
  // Parse query params (is string)
  params.limit = +params.limit
  params.page = +params.page

  // Define
  const skip = params.limit * params.page
  const sort = [[TftMatchEnum.SORT_BY, TftMatchEnum.SORT_BY_ORDER]]
  const condition = { participantsIds: id }
  const requestLimit = skip + params.limit

  return {
    skip,
    sort,
    condition,
    requestLimit
  }
}
