import { Module } from '@nestjs/common'
import { StaticDataService } from './static-data.service'

@Module({
  providers: [StaticDataService],
  exports: [StaticDataService]
})
export class StaticDataModule {}
