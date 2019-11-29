import { Module } from '@nestjs/common'
import { StatsService } from './stats.service'
import { SummonerModel, TftMatchModel, TftSummonerStatsModel } from 'twisted-models'
import { SummonersModule } from '../summoners/summoners.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([
      TftMatchModel,
      TftSummonerStatsModel
    ]),
    SummonersModule
  ],
  providers: [StatsService],
  exports: [StatsService]
})
export class StatsModule {}
