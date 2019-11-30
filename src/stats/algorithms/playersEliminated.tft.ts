import { findSummoner } from '.'
import { ITFTMatchModel } from '@twisted.gg/models'

export function playersEliminated (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  let playersEliminated = 0
  for (const match of matches) {
    const { players_eliminated } = findSummoner(puuid, match.participants || [])
    playersEliminated += players_eliminated || 0
  }
  if (playersEliminated < 0) {
    throw new Error('Bad Eliminated players')
  }
  return playersEliminated
}
