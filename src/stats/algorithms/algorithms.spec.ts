import {
  isWin,
  findSummoner,
  winrate,
  getQueues,
  playersEliminated,
  keyAverage,
  mostUsedTraits,
  mostUsedUnits,
  getTraits,
  percentagePerPlacement,
  getItems
} from '.'
import { NotFoundException } from '@nestjs/common'
import { TftMatchEnum } from '../../enums/app.enum'

describe('Tft algorithms', () => {
  const puuid = '123'

  describe('IsWin', () => {
    const minWin = TftMatchEnum.PLACEMENT_WIN

    it('should return false when param is undefined', () => {
      expect(isWin()).toEqual(false)
    })

    it(`should return true when param is lower than ${minWin}`, () => {
      expect(isWin(3)).toEqual(true)
    })

    it(`should return true when param is equal to ${minWin}`, () => {
      expect(isWin(4)).toEqual(true)
    })

    it(`should return false when param is greater than ${minWin}`, () => {
      expect(isWin(5)).toEqual(false)
    })
  })

  describe('Percentage per placement', () => {
    it('should return error when participants doesn\'t exists', () => {
      const matches = [
        {
        }
      ]
      expect(() => percentagePerPlacement(puuid, matches)).toThrowError(NotFoundException)
    })

    it('should response unique placement 100%', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            placement: 1
          }
        ]
      }
      const [result] = percentagePerPlacement(puuid, [match])
      expect(result).toEqual({ placement: 1, percentage: 100, total: 1 })
    })

    it('should response placements (2/3)%', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid },
              placement: 1
            }
          ]
        },
        {
          participants: [
            {
              summoner: { puuid },
              placement: 1
            }
          ]
        },
        {
          participants: [
            {
              summoner: { puuid },
              placement: 3
            }
          ]
        }
      ]
      const [result] = percentagePerPlacement(puuid, matches)
      expect(result).toEqual({ placement: 1, percentage: 2 / 3 * 100, total: 2 })
    })

    it('should response empty placements when placement is undefined', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid }
            }
          ]
        }
      ]
      const result = percentagePerPlacement(puuid, matches)
      expect(result).toEqual([])
    })
  })

  describe('FindSummoner', () => {
    it('should return error when summoner doesn\'t exists', () => {
      const participants = []
      expect(() => findSummoner(puuid, participants)).toThrowError(NotFoundException)
    })

    it('should return error when summoner doesn\'t has a puuid', () => {
      const participants = [{ summoner: {} }]
      expect(() => findSummoner(puuid, participants)).toThrowError(NotFoundException)
    })

    it('should return the user filtered', () => {
      const participants = [
        {
          summoner: {
            puuid
          }
        },
        {
          summoner: {
            puuid: '12'
          }
        }
      ]
      const summoner = findSummoner(puuid, participants)
      expect(summoner).toEqual({ summoner: { puuid } })
    })
  })

  describe('Winrate', () => {
    it('should return error when participants doesn\'t exists', () => {
      const matches = [
        {
        }
      ]
      expect(() => winrate(puuid, matches)).toThrowError(NotFoundException)
    })

    it('should return 100% winrate percent', () => {
      const matches = [
        {
          participants: [
            {
              placement: 1,
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const percentage = winrate(puuid, matches)
      expect(percentage).toEqual(100)
    })

    it('should return 0% winrate percent', () => {
      const matches = [
        {
          participants: [
            {
              placement: 5,
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const percentage = winrate(puuid, matches)
      expect(percentage).toEqual(0)
    })

    it('should return 33.33% winrate percent', () => {
      const matches = [
        {
          participants: [
            {
              placement: 5,
              summoner: {
                puuid
              }
            }
          ]
        },
        {
          participants: [
            {
              placement: 5,
              summoner: {
                puuid
              }
            }
          ]
        },
        {
          participants: [
            {
              placement: 1,
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const percentage = winrate(puuid, matches)
      expect(percentage).toEqual(1 / 3 * 100)
    })
  })

  describe('GetQueues', () => {
    it('should return list of queues', () => {
      const matches = [
        {
          queue: {
            queueId: 0
          }
        },
        {
          queue: {
            queueId: 1
          }
        }
      ]
      const queues = getQueues(matches)
      expect(queues).toEqual([0, 1])
    })

    it('should return list of queues with duplicates', () => {
      const matches = [
        {
          queue: {
            queueId: 0
          }
        },
        {
          queue: {
            queueId: 0
          }
        }
      ]
      const queues = getQueues(matches)
      expect(queues).toEqual([0])
    })

    it('should return list of queues when someone of them hasn\'t queue field', () => {
      const matches = [
        {
          queue: {
            queueId: 0
          }
        },
        {
          queue: undefined
        }
      ]
      const queues = getQueues(matches)
      expect(queues).toEqual([0])
    })
  })

  describe('GetTraits', () => {
    it('should return error when participants doesn\'t exists', () => {
      const matches = [
        {
        }
      ]
      expect(() => getTraits(puuid, matches)).toThrowError(NotFoundException)
    })

    it('should return an empty array', () => {
      const matches = []
      const queues = getTraits(puuid, matches)
      expect(queues).toEqual([])
    })

    it('should return list of traits', () => {
      const matches = [
        {
          participants: [
            {
              traits: [
                {
                  name: 'Demon',
                  tier_current: 1
                }
              ],
              summoner: {
                puuid
              }
            }
          ]
        },
        {
          participants: [
            {
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const queues = getTraits(puuid, matches)
      expect(queues).toEqual(['Demon'])
    })

    it('should return list of traits (multiple)', () => {
      const matches = [
        {
          participants: [
            {
              traits: [
                {
                  name: 'Demon',
                  tier_current: 1
                },
                {}
              ],
              summoner: {
                puuid
              }
            }
          ]
        },
        {
          participants: [
            {
              summoner: {
                puuid
              }
            }
          ]
        }
      ]
      const queues = getTraits(puuid, matches)
      expect(queues).toEqual(['Demon'])
    })
  })

  describe('PlayersEliminated', () => {
    it('should return error when participants doesn\'t exists', () => {
      const matches = [
        {
        }
      ]
      expect(() => playersEliminated(puuid, matches)).toThrowError(NotFoundException)
    })

    it('should return zero Eliminated players', () => {
      const matches = []
      const players = playersEliminated(puuid, matches)
      expect(players).toEqual(0)
    })

    it('should return 1 Eliminated players', () => {
      const matches = [
        {
          participants: [
            {
              players_eliminated: 1,
              summoner: {
                puuid
              }
            },
            {
              players_eliminated: 1,
              summoner: {
                puuid: '123'
              }
            }
          ]
        }
      ]
      const players = playersEliminated(puuid, matches)
      expect(players).toEqual(1)
    })

    it('should return 0 when key doesn\'t exists', () => {
      const matches = [
        {
          participants: [
            {
              summoner: {
                puuid
              }
            },
            {
              summoner: {
                puuid: '123'
              }
            }
          ]
        }
      ]
      const players = playersEliminated(puuid, matches)
      expect(players).toEqual(0)
    })

    it('should return 20 Eliminated players (multiple matches)', () => {
      const match = {
        participants: [
          {
            players_eliminated: 10,
            summoner: {
              puuid
            }
          },
          {
            players_eliminated: 1,
            summoner: {
              puuid: '123'
            }
          }
        ]
      }
      const matches = [match, match]
      const players = playersEliminated(puuid, matches)
      expect(players).toEqual(20)
    })

    it('should return error when Eliminated players is lower than 0', () => {
      const matches = [
        {
          participants: [
            {
              players_eliminated: -1,
              summoner: {
                puuid
              }
            },
            {
              players_eliminated: 1,
              summoner: {
                puuid: '123'
              }
            }
          ]
        }
      ]
      expect(() => playersEliminated(puuid, matches)).toThrowError()
    })
  })

  describe('Key average', () => {
    it('should return error when participants is undefined', () => {
      const match = {
        participants: undefined
      }
      expect(() => keyAverage(puuid, [match], 'gold_left')).toThrowError()
    })

    it('should return a valid sum of key', () => {
      const match = {
        participants: [
          {
            gold_left: 1
          },
          {
            gold_left: 2,
            summoner: {
              puuid
            }
          }
        ]
      }
      const matches = [match, match]
      const result = keyAverage(puuid, matches, 'gold_left')
      const sumExpected = 4
      expect(result).toEqual(sumExpected / matches.length)
    })

    it('should return 0 when matches is length is 0', () => {
      const matches = []
      const result = keyAverage(puuid, matches, 'gold_left')
      const sumExpected = 0
      expect(result).toEqual(sumExpected)
    })

    it('should return 0 when the key doesn\'t exists', () => {
      const match = {
        participants: [
          {
            gold_left: 1
          },
          {
            gold_left: 2,
            summoner: {
              puuid
            }
          }
        ]
      }
      const matches = [match, match]
      const result = keyAverage(puuid, matches, 'gold_lefts')
      const sumExpected = 0
      expect(result).toEqual(0)
    })
  })

  describe('Most used traits', () => {
    it('should return error when participants doesn\'t exists', () => {
      const matches = [
        {
        }
      ]
      expect(() => mostUsedTraits(puuid, matches)).toThrowError(NotFoundException)
    })

    it('should return error when traits key doesn\'t exists', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid }
            }
          ]
        }
      ]
      expect(() => mostUsedTraits(puuid, matches)).toThrowError()
    })

    it('should return an empty array when matches.length is zero', () => {
      const matches = []
      const result = mostUsedTraits(puuid, matches)
      expect(result).toEqual([])
    })

    it('should return a simple traits most used array (empty name and num_units)', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            traits: [
              {
              }
            ]
          }
        ]
      }
      const matches = [match, match]
      const result = mostUsedTraits(puuid, matches)
      const totalTraits = result.reduce<number>((prev, curr) => {
        prev += curr.num_units
        return prev
      }, 0)
      expect(totalTraits).toEqual(0)
    })

    it('should return a simple traits most used array', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            traits: [
              {
                name: 'Pirate',
                num_units: 1
              }
            ]
          }
        ]
      }
      const matches = [match, match]
      const result = mostUsedTraits(puuid, matches)
      const totalPirates = result.reduce<number>((prev, curr) => {
        prev += curr.num_units
        return prev
      }, 0)
      expect(totalPirates).toEqual(2)
    })

    it('should return a ordered traits array', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid },
              traits: [
                {
                  name: 'Pirate',
                  num_units: 1
                }
              ]
            }
          ]
        },
        {
          participants: [
            {
              summoner: { puuid },
              traits: [
                {
                  name: 'Pirate',
                  num_units: 1
                },
                {
                  name: 'Sorcerrer',
                  num_units: 1
                }
              ]
            }
          ]
        }
      ]
      const result = mostUsedTraits(puuid, matches)
      const expected = [
        {
          name: 'Pirate',
          num_units: 2,
          games: 2
        },
        {
          name: 'Sorcerrer',
          num_units: 1,
          games: 1
        }
      ]
      expect(result).toEqual(expected)
    })
  })

  describe('Most used units', () => {
    it('should return error when participants doesn\'t exists', () => {
      const matches = [
        {
        }
      ]
      expect(() => mostUsedUnits(puuid, matches)).toThrowError(NotFoundException)
    })

    it('should return error when units key doesn\'t exists', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid }
            }
          ]
        }
      ]
      expect(() => mostUsedUnits(puuid, matches)).toThrowError()
    })

    it('should return an empty array when matches.length is zero', () => {
      const matches = []
      const result = mostUsedUnits(puuid, matches)
      expect(result).toEqual([])
    })

    it('should return a simple units most used array', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            units: [
              {
                name: 'Twisted',
                character_id: '1',
                num_units: 1
              }
            ]
          }
        ]
      }
      const matches = [match, match]
      const result = mostUsedUnits(puuid, matches)
      const totalTwisted = result.reduce<number>((prev, curr) => {
        prev += curr.games
        return prev
      }, 0)
      expect(totalTwisted).toEqual(2)
    })

    it('should return a ordered units array', () => {
      const matches = [
        {
          participants: [
            {
              summoner: { puuid },
              units: [
                {
                  name: 'Twisted',
                  character_id: '1'
                }
              ]
            }
          ]
        },
        {
          participants: [
            {
              summoner: { puuid },
              units: [
                {
                  name: 'Twisted',
                  character_id: '1'
                },
                {
                  name: 'Aurelion',
                  character_id: '2'
                }
              ]
            }
          ]
        }
      ]
      const result = mostUsedUnits(puuid, matches)
      const expected = [
        {
          name: 'Twisted',
          character_id: '1',
          games: 2
        },
        {
          name: 'Aurelion',
          character_id: '2',
          games: 1
        }
      ]
      expect(result).toEqual(expected)
    })
  })

  describe('Get items', () => {
    it('should return error when participants doesn\'t exists', () => {
      const matches = [
        {
        }
      ]
      expect(() => getItems(puuid, matches)).toThrowError(NotFoundException)
    })

    it('should return correct item list', () => {
      const match = {
        participants: [
          {
            summoner: { puuid },
            units: [
              {
                tier: 0,
                character_id: '1',
                rarity: 1,
                name: '',
                items: [
                  {
                    name: 'idk',
                    id: 8
                  }
                ]
              },
              {
                tier: 0,
                character_id: '1',
                rarity: 1,
                name: '',
                items: [
                  {
                    name: 'idk',
                    id: 9
                  }
                ]
              },
              {
                tier: 0,
                character_id: '1',
                rarity: 1,
                name: '',
                items: [
                  {
                    name: 'idk',
                    id: 9
                  }
                ]
              },
              {}
            ]
          }
        ]
      }
      const items = getItems(puuid, [match])
      const itemIds = items.map(i => i.id)
      expect(itemIds).toEqual([8, 9])
    })

    it('should return an empty array when units doesnt exists', () => {
      const match = {
        participants: [
          {
            summoner: { puuid }
          }
        ]
      }
      const items = getItems(puuid, [match])
      const itemIds = items.map(i => i.id)
      expect(itemIds).toEqual([])
    })
  })
})
