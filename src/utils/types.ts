/**
 * 카드
 */
export interface Card {
  width: number;
  height: number;
  color: string;
  isFirst: boolean;
}

/**
 * 카드 위치
 */
export type CardPosition = 'top' | 'bottom';

/**
 * key-value form
 */
export interface KeyValueForm {
  [key: string]: number | string | boolean;
}
