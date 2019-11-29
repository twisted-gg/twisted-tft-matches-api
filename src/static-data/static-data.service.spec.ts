import { Test, TestingModule } from '@nestjs/testing'
import { StaticDataService } from './static-data.service'

describe('StaticDataService', () => {
  let service: StaticDataService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaticDataService]
    }).compile()

    service = module.get<StaticDataService>(StaticDataService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
