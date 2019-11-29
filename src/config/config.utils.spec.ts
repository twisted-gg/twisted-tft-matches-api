import { parseMongoUri } from './config.utils'

describe('Config utils', () => {
  describe('Mongo uri', () => {
    it('should return a valid url', () => {
      const host = 'host'
      const port = 123
      const user = 'user'
      const password = 'password'
      const dbname = 'dbname'
      const adminAuth = false

      const response = parseMongoUri(host, port, user, password, dbname, adminAuth)
      const expected = `mongodb://${user}:${password}@${host}:${port}/${dbname}`

      expect(response).toEqual(expected)
    })

    it('should return a valid url with admin source', () => {
      const host = 'host'
      const port = 123
      const user = 'user'
      const password = 'password'
      const dbname = 'dbname'
      const adminAuth = true

      const response = parseMongoUri(host, port, user, password, dbname, adminAuth)
      const expected = `mongodb://${user}:${password}@${host}:${port}/${dbname}?authSource=admin`

      expect(response).toEqual(expected)
    })
  })
})
