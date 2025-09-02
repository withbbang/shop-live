import { CardType } from './types';

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
 * @returns {CARD} 카드
 */
export function createCard(): CardType {
  return {
    id: `${Math.floor(Math.random() * 0xffffff).toString(16)}`,
    color: createRandomColor(),
  };
}

/**
 * 색깔 출력 함수
 * @param {string} color 색깔
 */
export function callCustomAlert(color: string): void {
  alert(`Color: ${color}`);
}
