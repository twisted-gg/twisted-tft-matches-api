import { Module } from '@nestjs/common'
import { SummonersService } from './summoners.service'

@Module({
  providers: [SummonersService],
  exports: [SummonersService]
})
export class SummonersModule {}
