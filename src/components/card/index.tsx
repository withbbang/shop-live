import React, { useRef } from 'react';
import { useChangeHook } from 'utils/hooks';
import { CardPositionType, KeyValueFormType } from 'utils/types';
import { callCustomAlert } from 'utils/utils';
import styles from './Card.module.scss';

function Card({
  position,
  color,
  width,
  height,
  idx,
  onResetCard,
}: CardProps): React.JSX.Element {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { form, setForm } = useChangeHook({
    isSwiping: false, // 스와이프 진행 여부
    startX: 0, // 스와이프 시작 위치
    translateX: 0, // 스와이프 이동 거리
  });

  /**
   * 클릭/터치 시작
   * @param {React.MouseEvent} e 마우스 이벤트
   * @returns {void}
   */
  const handleDown = (e: React.MouseEvent) => {
    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      isSwiping: true,
      startX: e.clientX,
    }));
  };

  /**
   * 클릭/터치 중
   * @param {React.MouseEvent} e 마우스 이벤트
   * @returns {void}
   */
  const handleMove = (e: React.MouseEvent) => {
    if (!!!form.isSwiping) return;

    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      translateX: e.clientX - +form.startX,
    }));
  };

  /**
   * 클릭/터치 종료
   * @returns {void}
   */
  const handleUp = () => {
    if (!!!form.isSwiping) return;

    if (Math.abs(+form.translateX) >= width / 2)
      onResetCard(position); // 스와이프 거리가 카드의 1/2 이상이면 카드 리셋
    else
      setForm((prevState: KeyValueFormType) => ({
        ...prevState,
        translateX: 0,
      }));

    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      isSwiping: false,
    }));
  };

  /**
   * 카드 클릭
   * @returns {void}
   */
  const handleClick = () => {
    callCustomAlert(color);
  };

  return (
    <div
      className={styles.wrap}
      ref={idx != 0 ? cardRef : null}
      style={{
        transform: `translateX(${+form.translateX}px)`,
        transition: !!form.isSwiping ? 'none' : 'transform 0.3s ease',
        opacity: 1 - Math.min(Math.abs(+form.translateX) / 300, 1),
        width,
        height,
        background: color,
        borderRadius: '8px',
        userSelect: 'none',
        cursor: 'grab',
      }}
      onClick={handleClick}
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
    >
      {color}
    </div>
  );
}

interface CardProps {
  position: CardPositionType;
  color: string;
  width: number;
  height: number;
  idx: number;
  onResetCard: (pos: CardPositionType) => void;
}

export default Card;
