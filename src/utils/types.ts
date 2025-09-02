/**
 * 카드
 */
export interface CardType {
  id: string;
  color: string;
}

/**
 * 카드 위치
 */
export type CardPositionType = 'top' | 'bottom';

/**
 * key-value form
 */
export interface KeyValueFormType {
  [key: string]: number | string | boolean;
}
