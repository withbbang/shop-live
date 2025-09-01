import {
  BOTTOM_CARD_HEIGHT,
  BOTTOM_CARD_WIDTH,
  TOP_CARD_HEIGHT,
  TOP_CARD_WIDTH,
} from './constants';
import { Card, CardPosition } from './types';

/**
 * 랜덤 색깔 생성 함수
 * @returns {string} 카드 색깔
 */
export function createRandomColor(): string {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
}

/**
 * 카드 생성 함수
 * @param {CardPosition} pos 카드 위치
 * @param {boolean} isFirst 첫번째 여부
 * @returns {CARD} 카드
 */
export function createCard(pos: CardPosition, isFirst: boolean): Card {
  if (pos === 'top') {
    return {
      width: TOP_CARD_WIDTH,
      height: TOP_CARD_HEIGHT,
      color: createRandomColor(),
      isFirst,
    };
  } else {
    return {
      width: BOTTOM_CARD_WIDTH,
      height: BOTTOM_CARD_HEIGHT,
      color: createRandomColor(),
      isFirst,
    };
  }
}

/**
 * 색깔 출력 함수
 * @param {string} color 색깔
 */
export function callCustomAlert(color: string): void {
  alert(`Color: ${color}`);
}
