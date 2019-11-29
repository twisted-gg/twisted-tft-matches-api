import { TftMatchEnum } from '../../enums/app.enum'

export function isWin (placement?: number) {
  if (!placement) {
    return false
  }
  return placement <= TftMatchEnum.PLACEMENT_WIN
}
