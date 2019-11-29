import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { RiotApiModule } from './riot-api/riot-api.module'
import { ConfigModule } from './config/config.module'
import { DatabaseConnection } from './database/database.connection'
import { CacheService } from './cache/cache.service'
import { OriginMiddleware } from 'twisted-common'
import { StaticDataModule } from './static-data/static-data.module'
import { SummonersModule } from './summoners/summoners.module'
import { MatchModule } from './match/match.module'

@Module({
  imports: [
    DatabaseConnection,
    ConfigModule,
    RiotApiModule,
    MatchModule,
    StaticDataModule,
    SummonersModule
  ],
  providers: [CacheService]
})
export class AppModule implements NestModule {
  configure (consumer: MiddlewareConsumer) {
    consumer
      .apply(OriginMiddleware)
      .forRoutes('*')
  }
}
