import * as _ from 'lodash'
import { ITFTMatchModel } from 'twisted-models'
import * as algorithms from './algorithms'
import { GetProfileTftStats } from '../models/stats/summoner.dto'
enum TFTMatchKeys {
  GOLD = 'gold_left',
  LEVEL = 'level',
  LAST_ROUND = 'last_round',
  DAMAGE_TO_PLAYERS = 'total_damage_to_players'
}

export function ObjectResponse (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  return {
    games: matches.length,
    winrate: algorithms.winrate(puuid, matches),
    playersEliminated: algorithms.playersEliminated(puuid, matches),
    placements: algorithms.percentagePerPlacement(puuid, matches),
    averages: {
      goldLeft: algorithms.keyAverage(puuid, matches, TFTMatchKeys.GOLD),
      level: algorithms.keyAverage(puuid, matches, TFTMatchKeys.LEVEL),
      lastRound: algorithms.keyAverage(puuid, matches, TFTMatchKeys.LAST_ROUND),
      damageToPlayers: algorithms.keyAverage(puuid, matches, TFTMatchKeys.DAMAGE_TO_PLAYERS)
    },
    mostUsed: {
      units: algorithms.mostUsedUnits(puuid, matches),
      traits: algorithms.mostUsedTraits(puuid, matches)
    }
  }
}

export function FilterByTrait (trait: string, puuid: string, matches: Partial<ITFTMatchModel>[]) {
  return matches.filter(match => {
    const { traits } = algorithms.findSummoner(puuid, match.participants || [])
    if (!traits) {
      return false
    }
    const index = traits.findIndex(t => t.name === trait && !!t.tier_current)
    return index !== -1
  })
}

export function FilterByItem (item: number, puuid: string, matches: Partial<ITFTMatchModel>[]) {
  return matches.filter(match => {
    const { units } = algorithms.findSummoner(puuid, match.participants || [])
    if (!units) {
      return false
    }
    let index = -1
    for (const unit of units) {
      index = (unit.items || []).findIndex(i => i && i.id === item)
      if (index !== -1) {
        break
      }
    }
    return index !== -1
  })
}

export function FindOptions (summoner: string, params: GetProfileTftStats) {
  const options: any = { summoner }
  if (params.statName) {
    options.name = params.statName
  }
  if (params.queue) {
    options.queue = params.queue
  }
  return options
}
