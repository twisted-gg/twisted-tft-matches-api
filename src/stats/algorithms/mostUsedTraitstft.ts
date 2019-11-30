import { orderBy } from 'lodash'
import { findSummoner } from './findSummoner.tft'
import { ITFTMatchModel } from '@twisted.gg/models'
import { TftMatchEnum } from '../../enums/app.enum'

export function mostUsedTraits (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  let response: {
    name: string,
    num_units: number,
    games: number
  }[] = []
  for (const match of matches) {
    // Find traits
    const { traits } = findSummoner(puuid, match.participants || [])
    if (!traits) {
      throw new Error('Invalid model (participant traits)')
    }
    // Iterate over traits
    for (const value of traits) {
      const { name = '', num_units = 0 } = value
      const findIndex = response.findIndex(r => r.name === name)
      // Upsert
      if (findIndex !== -1) {
        response[findIndex].num_units += num_units
      } else {
        response.push({
          name,
          num_units,
          games: 0
        })
      }
    }
    response = response.map((val) => {
      val.games++
      return val
    })
  }

  return orderBy(response, v => -v.games)
    .slice(0, TftMatchEnum.MOST_TRAITS_TOTAL)
}
