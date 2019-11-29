import { findSummoner } from '.'
import { ITFTMatchModel } from 'twisted-models'

export function keyAverage (puuid: string, matches: Partial<ITFTMatchModel>[], key: string) {
  let total = 0
  if (!matches.length) {
    return 0
  }
  for (const match of matches) {
    let value = findSummoner(puuid, match.participants || [])[key] as number
    if (!value) {
      value = 0
    }
    total += value
  }
  return total / matches.length
}
