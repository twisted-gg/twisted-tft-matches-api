import { ApiModelPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsNumberString } from 'class-validator'
import { TftMatchStatsEnum } from '../../enums/app.enum'
import { GetSummonerQueryDTO } from '@twisted.gg/common'

const name = Object.values(TftMatchStatsEnum)
console.log(name)
export class GetProfileTftStats extends GetSummonerQueryDTO {
  @ApiModelPropertyOptional({ enum: name, type: String })
  @IsEnum(name)
  @IsOptional()
  statName?: TftMatchStatsEnum

  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  queue?: number
}
