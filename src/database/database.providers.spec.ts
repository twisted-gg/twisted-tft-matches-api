import { useValue } from './database.providers'

describe('Database providers', () => {
  it('should return promise repository method mocks', () => {
    const keys = Object.keys(useValue)
    for (const key of keys) {
      const value = useValue[key]
      expect(value()).toBeInstanceOf(Promise)
    }

    expect(useValue).toHaveProperty('find')
    expect(useValue).toHaveProperty('findOne')
    expect(useValue).toHaveProperty('create')
    expect(useValue).toHaveProperty('countDocuments')
  })
})
