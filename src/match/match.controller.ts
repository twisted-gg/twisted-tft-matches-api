import { Controller, Post, Query, Get, Param } from '@nestjs/common'
import { MatchService } from './match.service'
import { ApiUseTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { QueryTftMatches } from '../models/match/dto/query.tft-match.dto'
import { UpdateSummonerTFTMatchDTO } from '../models/match/dto/update-summoner.tft-match.dto'
import { TotalTFTMatchesDTO } from '../models/match/dto/total.tft-match.dto'
import { GetSummonerQueryDTO } from '@twisted.gg/common'
import { TftMatchModelDTO, TftMatchModelDTOListingMatches, TftMatchModelDTOListing } from '@twisted.gg/models'
import { GetProfileTftStats } from '../models/stats/summoner.dto'

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
    return this.service.updateStats(params)
  }

  @Get('details/:id')
  @ApiOkResponse({ type: TftMatchModelDTO })
  @ApiOperation({
    title: 'Summoner match details'
  })
  @ApiUseTags('Getters')
  async get (@Param('id') id: string) {
    return this.service.get(id)
  }

  @Get('summoner')
  @ApiOkResponse({ type: TftMatchModelDTOListing })
  @ApiOperation({
    title: 'Get summoner matches'
  })
  @ApiUseTags('Getters')
  async getBySummoner (@Query() params: QueryTftMatches) {
    return this.service.getBySummoner(params)
  }

  @Get('summoner/stats')
  @ApiOperation({
    title: 'Get summoner matcehs'
  })
  @ApiUseTags('Getters')
  async getSummonerStats (@Query() params: GetProfileTftStats) {
    return this.service.getSummonerStats(params)
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
