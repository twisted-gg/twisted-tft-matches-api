import { Module } from '@nestjs/common'
import { MatchService } from './match.service'
import { MongooseModule } from '@nestjs/mongoose'
import { MatchController } from './match.controller'
import { StaticDataModule } from '../static-data/static-data.module'
import { TftMatchModel } from '@twisted.gg/models'
import { SummonersModule } from '../summoners/summoners.module'
import { StatsModule } from '../stats/stats.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      TftMatchModel
    ]),
    StaticDataModule,
    SummonersModule,
    StatsModule
  ],
  providers: [MatchService],
  controllers: [MatchController]
})
export class MatchModule {}
