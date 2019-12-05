export enum AppSwaggerEnum {
  TITLE = 'Twisted - TFT Matches api',
  DESCRIPTION = 'TFT matches methods',
  PATH = 'explorer',
  PORT= 3001
}

export enum TftMatchEnum {
  SORT_BY = 'game_datetime',
  SORT_BY_ORDER = -1,
  PLACEMENT_WIN = 4,
  MOST_TRAITS_TOTAL = 4,
  MOST_UNITS_TOTAL = 10
}

export enum TftMatchStatsEnum {
  GLOBAL_STATS = 'GLOBAL_STATS',
  BY_TRAIT = 'STATS_BY_TRAIT',
  BY_ITEMS = 'STATS_BY_ITEM',
  BY_QUEUES = 'STATS_BY_QUEUE'
}

export enum LimitsEnum {
  MATCH_LIMIT_MAX = 30,
  MATCH_LIMIT_MIN = 0,
  MATCH_PAGE_MIN = 0,
  MIN_MATCHES_TO_STATS = 10
}
