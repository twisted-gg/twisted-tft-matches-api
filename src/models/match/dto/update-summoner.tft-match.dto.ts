import { ApiResponseModelProperty } from '@nestjs/swagger'

export class UpdateSummonerTFTMatchDTO {
  @ApiResponseModelProperty()
  msg!: string
}
