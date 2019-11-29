import { ApiModelProperty } from '@nestjs/swagger'
import { IsInt, Max, Min, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { typeNumber, GetSummonerQueryDTO } from 'twisted-models'
import { LimitsEnum } from '../../../enums/app.enum'

export class QueryTftMatches extends GetSummonerQueryDTO {
  @ApiModelProperty()
  @IsNotEmpty()
  @Type(typeNumber)
  @IsInt()
  @Max(LimitsEnum.MATCH_LIMIT_MAX)
  @Min(LimitsEnum.MATCH_LIMIT_MIN)
  limit!: number

  @ApiModelProperty()
  @Type(typeNumber)
  @IsInt()
  @Min(LimitsEnum.MATCH_PAGE_MIN)
  @IsNotEmpty()
  page!: number
}
