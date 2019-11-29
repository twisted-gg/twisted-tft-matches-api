import { findSummoner, isWin } from '.'
import { ITFTMatchModel } from 'twisted-models'

export function winrate (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  const wins = matches.filter((m) => {
    const summoner = findSummoner(puuid, m.participants || [])
    return summoner && isWin(summoner.placement)
  })
  const percentage = wins.length / matches.length * 100
  return percentage || 0
}
