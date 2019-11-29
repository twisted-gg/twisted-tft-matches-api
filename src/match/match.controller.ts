import { Controller, Post, Query, Get } from '@nestjs/common'
import { MatchService } from './match.service'
import { ApiUseTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { QueryTftMatches } from '../models/match/dto/query.tft-match.dto'
import { UpdateSummonerTFTMatchDTO } from '../models/match/dto/update-summoner.tft-match.dto'
import { TotalTFTMatchesDTO } from '../models/match/dto/total.tft-match.dto'
import { GetSummonerQueryDTO } from 'twisted-common'
import { TftMatchModelDTO } from 'twisted-models'

@Controller()
export class MatchController {
  constructor (
    private readonly service: MatchService
  ) {}

  @Post('summoner')
  @ApiOkResponse({ type: [UpdateSummonerTFTMatchDTO] })
  @ApiOperation({
    title: 'Update summoner matches'
  })
  @ApiUseTags('Update')
  async update (@Query() params: GetSummonerQueryDTO) {
    return this.service.updateSummoner(params)
  }

  @Get('summoner')
  @ApiOkResponse({ type: [TftMatchModelDTO] })
  @ApiOperation({
    title: 'Get summoner matcehs'
  })
  @ApiUseTags('Getters')
  async getBySummoner (@Query() params: QueryTftMatches) {
    return this.service.getBySummoner(params)
  }

  @Get('total')
  @ApiOkResponse({ type: TotalTFTMatchesDTO })
  @ApiOperation({
    title: 'Get total values'
  })
  @ApiUseTags('Getters')
  async total () {
    return this.service.total()
  }
}
