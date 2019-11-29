import { findSummoner } from '.'
import { ITFTMatchModel } from 'twisted-models'

export function percentagePerPlacement (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  const values: { placement: number, total: number }[] = []
  for (const match of matches) {
    const { placement } = findSummoner(puuid, match.participants || [])
    if (placement) {
      const findIndex = values.findIndex(v => v.placement === placement)
      if (findIndex === -1) {
        values.push({
          placement,
          total: 1
        })
      } else {
        values[findIndex].total++
      }
    }
  }

  return values.map(val => ({
    placement: val.placement,
    percentage: val.total / matches.length * 100,
    total: val.total
  }))
}
