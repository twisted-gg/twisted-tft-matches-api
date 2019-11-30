import { findSummoner } from '.'
import * as _ from 'lodash'
import { IStaticTftItemsModel, ITFTMatchModel } from '@twisted.gg/models'

export function getItems (puuid: string, matches: Partial<ITFTMatchModel>[]) {
  const response: IStaticTftItemsModel[] = []
  for (const match of matches) {
    const { units } = findSummoner(puuid, match.participants || [])
    if (!units) {
      continue
    }
    const listOfItems = units.reduce<IStaticTftItemsModel[]>((prev, curr) => {
      const {
        items = []
      } = curr
      prev.push(...items as IStaticTftItemsModel[])
      return prev
    }, [])
    response.push(..._.uniqBy(listOfItems, 'id'))
  }
  return response.filter(r => !!r)
}
