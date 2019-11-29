import * as _ from 'lodash'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as defaultConfig from './configs/default'
import { Injectable } from '@nestjs/common'
import { MongooseModuleOptions } from '@nestjs/mongoose'
import * as utils from './config.utils'
export interface IConfig {
  [key: string]: any
}
dotenv.config()

export interface EnvConfig {
  [key: string]: string
}

@Injectable()
export class ConfigService {
  private config: IConfig = defaultConfig.default

  constructor () {
    this.loadEnv()
    this.loadConfiguration()
  }

  private set (key: string, value: any) {
    _.set(this.config, key, value)
  }

  private loadEnv () {
    const { env } = process
    for (const key in env) {
      const value = env[key]
      if (key.indexOf('npm_') !== 0) {
        this.set(key, value)
      }
    }
  }

  private loadConfiguration (customEnv?, testConfig?) {
    const { NODE_ENV } = customEnv || process.env
    if (!NODE_ENV) return false
    const path: string = `${__dirname}/configs/${NODE_ENV}`
    const availableExt: string[] = ['ts', 'js', 'json']
    let foundExt: boolean = false
    for (const ext of availableExt) {
      const fullPath: string = `${path}.${ext}`
      if (testConfig || fs.existsSync(fullPath)) {
        const configEnv = testConfig || require(fullPath).default
        this.config = _.merge(this.config, configEnv)
        foundExt = true
        break
      }
    }
    if (!foundExt) {
      return false
    }
    return true
  }

  get<T> (key: string): T {
    return _.get(this.config, key, key)
  }

  getBoolean (key: string): boolean {
    return this.get(key) === 'true'
  }

  getNumber (key: string): number {
    return +this.get<any>(key)
  }

  getConnection (): MongooseModuleOptions {
    const host = this.get<string>('database.host')
    const port = this.getNumber('database.port')
    const user = this.get<string>('database.user')
    const password = this.get<string>('database.password')
    const dbname = this.get<string>('database.dbname')
    const adminAuth = this.getBoolean('database.adminAuth')

    return {
      uri: utils.parseMongoUri(host, port, user, password, dbname, adminAuth),
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
}
