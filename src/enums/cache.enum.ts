const ms = require('ms')

/**
 * String to seconds
 * @param val String to convert
 */
function convert (val: string) {
  return ms(val) / 1000
}

export enum CacheTimes {
  SUMMONER = convert('2h'),
  TFT_MATCH_DETAILS = convert('10d'),
  TFT_MATCH_LISTING = convert('20m'),
  CURRENT_VERSION = convert('1w'),
  DEFAULT = convert('1h')
}

export enum CacheMessages {
  CONTEXT = 'CacheService',
  DISCONNECTED = 'Service is disabled'
}
