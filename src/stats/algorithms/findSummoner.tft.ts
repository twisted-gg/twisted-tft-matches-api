import { NotFoundException } from '@nestjs/common'
import { TftMatchParticipantsModel } from 'twisted-models'

export function findSummoner (puuid: string, participants: Partial<TftMatchParticipantsModel>[]) {
  const participant = participants.find(p => !!p.summoner && p.summoner.puuid === puuid)
  if (!participant) {
    throw new NotFoundException()
  }
  return participant
}
