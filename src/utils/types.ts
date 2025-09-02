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

/**
 * 카드 상태
 */
export type CardStatusType =
  | 'TO LEFT'
  | 'TO RIGHT'
  | 'SWIPE LEFT'
  | 'SWIPE RIGHT'
  | 'FLIP LEFT'
  | 'FLIP RIGHT'
  | 'AUTO TRANSITION'
  | 'CLICK'
  | 'CANCEL';
