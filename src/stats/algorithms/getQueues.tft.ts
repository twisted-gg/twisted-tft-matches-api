import { ITFTMatchModel } from '@twisted.gg/models'
import { uniq } from 'lodash'

export function getQueues (matches: Partial<ITFTMatchModel>[]) {
  const queues = matches.reduce<number[]>((prev, curr) => {
    if (!curr.queue || typeof curr.queue.queueId !== 'number') {
      return prev
    }
    const name = curr.queue.queueId
    prev.push(name)
    return prev
  }, [])
  return uniq(queues)
}
