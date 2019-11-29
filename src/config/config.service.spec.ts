import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from './config.service'
import { get } from 'lodash'

describe('ConfigService', () => {
  let service: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService]
    }).compile()
    service = module.get<ConfigService>(ConfigService)
  })

  it('should be defined', () => {
    const value = service
    expect(value).toBeInstanceOf(ConfigService)
  })

  describe('Internal methods', () => {
    it('should return valid value setted directly', () => {
      const key = 'testingKey'
      const value = 'testingValue'
      const setMethod = get(service, 'set').bind(service)
      setMethod(key, value)
      expect(service.get(key)).toEqual(value)
    })

    it('should return keyName value setted by configuration when NODE_ENV is undefined', () => {
      const key = 'testingKey2'
      const value = 'testingValue'
      const configuration = {
        testingKey: value
      }
      const load = get(service, 'loadConfiguration').bind(service)
      load(configuration)
      expect(service.get(key)).toEqual(key)
    })

    it('should return valid value setted by configuration when NODE_ENV exists', () => {
      const key = 'testingKey'
      const value = 'testingValue'
      const configuration = {
        testingKey: value
      }
      const load = get(service, 'loadConfiguration').bind(service)
      load({ NODE_ENV: 'test' }, configuration)
      expect(service.get(key)).toEqual(value)
    })

    it('should return false when NODE_ENV associated file test dont exists', () => {
      const load = get(service, 'loadConfiguration').bind(service)
      const response = load({
        NODE_ENV: 'dont exists'
      })
      expect(response).toEqual(false)
    })

    it('should return false when NODE_ENV is undefined', () => {
      const load = get(service, 'loadConfiguration').bind(service)
      const response = load({
        NODE_ENV: undefined
      })
      expect(response).toEqual(false)
    })

    it('should return true when NODE_ENV associated file test exists', () => {
      const load = get(service, 'loadConfiguration').bind(service)
      const response = load({
        NODE_ENV: 'test'
      })
      expect(response).toEqual(true)
    })
  })

  describe('Get method', () => {
    it('should return a simple test', () => {
      const value = typeof service.get('riot.apiKey')
      expect(value).toEqual('string')
    })

    it('should return key as value when key not exists', () => {
      const key = 'undefinedKey'
      const value = service.get(key)
      expect(value).toEqual(key)
    })

    it('should return a boolean', () => {
      const value = service.getBoolean('-')
      expect(value).toEqual(false)
    })

    it('should return false', () => {
      const value = service.getBoolean('false')
      expect(value).toEqual(false)
    })

    it('should return a true', () => {
      const value = service.getBoolean('true')
      expect(value).toEqual(true)
    })

    it('should return a number', () => {
      const value = typeof service.getNumber('-')
      expect(value).toEqual('number')
    })

    it('should return a NaN', () => {
      const value = service.getNumber('a')
      expect(value).toBeNaN()
    })

    it('should return a specific number', () => {
      const n = 10
      const value = service.getNumber(n.toString())
      expect(value).toEqual(n)
    })

    it('should return a specific number (negative)', () => {
      const n = -10
      const value = service.getNumber(n.toString())
      expect(value).toEqual(n)
    })
  })

  describe('Database connection', () => {
    it('should return valid database connection', () => {
      const configuration = {
        database: {
          host: '',
          port: 0,
          user: '',
          password: '',
          dbname: '',
          adminAuth: 'true'
        }
      }
      const load = get(service, 'loadConfiguration').bind(service)
      load(configuration)
      const connection = service.getConnection()
      expect(connection).toBeDefined()
      expect(connection).toHaveProperty('uri')
      expect(connection).toHaveProperty('useNewUrlParser')
      expect(connection).toHaveProperty('useUnifiedTopology')
    })
  })
})
