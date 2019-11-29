import { Module, Global } from '@nestjs/common'
import { RiotApiService } from './riot-api.service'
import { ConfigModule } from '../config/config.module'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RiotApiService],
  exports: [RiotApiService]
})
export class RiotApiModule {}
