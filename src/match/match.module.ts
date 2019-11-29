import { Module } from '@nestjs/common'
import { MatchService } from './match.service'
import { MongooseModule } from '@nestjs/mongoose'
import { MatchController } from './match.controller'
import { StaticDataModule } from '../static-data/static-data.module'
import { TftMatchModel } from 'twisted-models'
import { SummonersModule } from '../summoners/summoners.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      TftMatchModel
    ]),
    StaticDataModule,
    SummonersModule
  ],
  providers: [MatchService],
  controllers: [MatchController]
})
export class MatchModule {}
