import { ApiResponseModelProperty } from '@nestjs/swagger'

export class TotalTFTMatchesDTO {
  @ApiResponseModelProperty()
  count!: number

  @ApiResponseModelProperty()
  size!: number
}
