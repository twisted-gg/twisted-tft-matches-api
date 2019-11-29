import { findSummoner } from '.'
import { sortBy } from 'lodash'
import { ITFTMatchModel } from 'twisted-models'
import { TftMatchEnum } from '../../enums/app.enum'

export function mostUsedUnits (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  const response: {
    name?: string,
    character_id?: string,
    games: number,
    tier?: number
  }[] = []
  for (const match of matches) {
    const { units } = findSummoner(puuid, match.participants || [])
    if (!units) {
      throw new Error('Invalid model (participant units)')
    }
    for (const unit of units) {
      const findIndex = response.findIndex(r => r.name === unit.name)
      if (findIndex !== -1) {
        response[findIndex].games++
      } else {
        response.push({
          name: unit.name,
          character_id: unit.character_id,
          games: 1,
          tier: unit.tier
        })
      }
    }
  }

  return sortBy(response, r => -r.games)
    .slice(0, TftMatchEnum.MOST_UNITS_TOTAL)
}
