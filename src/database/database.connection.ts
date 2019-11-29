import { MongooseModule } from '@nestjs/mongoose'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'

export const DatabaseConnection = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => config.getConnection()
})
