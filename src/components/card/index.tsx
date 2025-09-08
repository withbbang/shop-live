import React, { useEffect, useRef, useState } from 'react';
import { PropState } from 'middlewares/configureReducer';
import { connect } from 'react-redux';
import {
  CommonState,
  useSetBottomStatus,
  useSetTopStatus,
} from 'middlewares/reduxToolkits/commonSlice';
import { Action } from 'redux-saga';
import { useChangeHook } from 'utils/hooks';
import {
  CardPositionType,
  CardStatusType,
  KeyValueFormType,
} from 'utils/types';
import { callCustomAlert } from 'utils/utils';
import { AUTO_SWIPE_TIME, SPEED_THRESHOLD } from 'utils/constants';
import styles from './Card.module.scss';

const mapStateToProps = (state: PropState): CommonState => {
  return {
    ...state.common,
  };
};

const mapDispatchToProps = (dispatch: (actionFunction: Action<any>) => any) => {
  return {
    useSetTopStatus: (payload: { topStatus: CardStatusType }): void => {
      dispatch(useSetTopStatus(payload));
    },
    useSetBottomStatus: (payload: { bottomStatus: CardStatusType }): void => {
      dispatch(useSetBottomStatus(payload));
    },
  };
};

function Card({
  topStatus,
  bottomStatus,
  position,
  color,
  width,
  height,
  idx,
  onResetCard,
  useSetTopStatus,
  useSetBottomStatus,
}: CardProps): React.JSX.Element {
  const [cardStatus, setCardStatus] =
    useState<CardStatusType>('AUTO TRANSITION'); // 카드 상태
  const cardRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined); // AUTO TRANSITION을 위한 setTimeout 레퍼런스
  const movementHistory = useRef<{ x: number; t: number }[]>([]); // FLIP 속도 계산을 위한 이동 기록
  const { form, setForm } = useChangeHook({
    isSwiping: false, // 스와이프 진행 여부
    isSwiped: false, // 스와이프 여부 추적
    startX: 0, // 스와이프 시작 위치
    translateX: 0, // 스와이프 이동 거리
  });

  useEffect(() => {
    if (idx === 0) return;

    // 스와이프 중일 땐 clear
    if (cardStatus === 'SWIPE LEFT' || cardStatus === 'SWIPE RIGHT') {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    // 그 외엔 AUTO TRANSITION으로 설정 (단, 이미 AUTO TRANSITION 상태면 설정 X)
    else {
      timeoutRef.current = setTimeout(() => {
        if (position === 'top' && topStatus !== 'AUTO TRANSITION')
          useSetTopStatus({ topStatus: 'AUTO TRANSITION' });
        if (position === 'bottom' && bottomStatus !== 'AUTO TRANSITION')
          useSetBottomStatus({ bottomStatus: 'AUTO TRANSITION' });
        if (cardStatus !== 'AUTO TRANSITION') setCardStatus('AUTO TRANSITION');
        handleRemoveCardWithAnimation(position, 1);
      }, AUTO_SWIPE_TIME);
    }

    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      movementHistory.current = [];
    };
  }, [idx, cardStatus]);

  /**
   * 스와이프 시작
   * @param {number} clientX 이벤트 x 시작 좌표
   * @returns {void}
   */
  const handleDown = (clientX: number): void => {
    movementHistory.current = [{ x: clientX, t: Date.now() }]; // 이동 기록 초기화

    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      isSwiping: true,
      isSwiped: false,
      startX: clientX,
    }));
  };

  /**
   * 스와이프 중
   * @param {number} clientX 이벤트 x 좌표
   * @returns {void}
   */
  const handleMove = (clientX: number): void => {
    if (!!!form.isSwiping) return;

    const now = Date.now();

    // 이동 기록 추가
    movementHistory.current.push({ x: clientX, t: now });
    // 200ms 이상 과거 기록 제거
    movementHistory.current = movementHistory.current.filter(
      (p) => now - p.t <= 200,
    );

    const dx = clientX - +form.startX;

    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      translateX: dx,
      isSwiped: Math.abs(dx) > 0,
    }));

    // 스와이프 방향 설정
    if (dx > 0) {
      if (position === 'top') useSetTopStatus({ topStatus: 'SWIPE RIGHT' });
      else useSetBottomStatus({ bottomStatus: 'SWIPE RIGHT' });
      setCardStatus('SWIPE RIGHT');
    } else if (dx < 0) {
      if (position === 'top') useSetTopStatus({ topStatus: 'SWIPE LEFT' });
      else useSetBottomStatus({ bottomStatus: 'SWIPE LEFT' });
      setCardStatus('SWIPE LEFT');
    } else {
      if (position === 'top') useSetTopStatus({ topStatus: 'CANCEL' });
      else useSetBottomStatus({ bottomStatus: 'CANCEL' });
      setCardStatus('CANCEL');
      return;
    }

    handleSetMovingCard(dx);
  };

  /**
   * 스와이프 종료
   * @param {number} clientX 이벤트 x 종료 좌표
   * @returns {void}
   */
  const handleUp = (clientX: number): void => {
    const now = Date.now();

    movementHistory.current.push({ x: clientX, t: now }); // 이동 종료 기록 추가

    const direction = +form.translateX > 0 ? 1 : -1; // 스와이프 방향 1: right, -1: left
    const firstRecord = movementHistory.current[0];
    const lastRecord =
      movementHistory.current[movementHistory.current.length - 1];
    const deltaX = lastRecord.x - firstRecord.x;
    const deltaT = lastRecord.t - firstRecord.t || 1;
    const speed = Math.abs(deltaX / deltaT);

    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      isSwiping: false,
    }));

    /**
     * if: 속도가 SPEED_THRESHOLD 이상이면 Flip
     * else if: 스와이프 거리가 카드의 1/2 이상이면 카드 리셋
     * else: 제자리
     */
    if (speed > SPEED_THRESHOLD) {
      if (direction === 1) {
        if (position === 'top') useSetTopStatus({ topStatus: 'FLIP RIGHT' });
        else useSetBottomStatus({ bottomStatus: 'FLIP RIGHT' });
        setCardStatus('FLIP RIGHT');
      } else {
        if (position === 'top') useSetTopStatus({ topStatus: 'FLIP LEFT' });
        else useSetBottomStatus({ bottomStatus: 'FLIP LEFT' });
        setCardStatus('FLIP LEFT');
      }
      handleRemoveCardWithAnimation(position, direction);
    } else if (Math.abs(+form.translateX) >= width / 2) {
      if (direction === 1) {
        if (position === 'top') useSetTopStatus({ topStatus: 'TO RIGHT' });
        else useSetBottomStatus({ bottomStatus: 'TO RIGHT' });
        setCardStatus('TO RIGHT');
      } else {
        if (position === 'top') useSetTopStatus({ topStatus: 'TO LEFT' });
        else useSetBottomStatus({ bottomStatus: 'TO LEFT' });
        setCardStatus('TO LEFT');
      }
      handleRemoveCardWithAnimation(position, direction);
    } else {
      setForm((prevState: KeyValueFormType) => ({
        ...prevState,
        translateX: 0,
      }));

      if (position === 'top') useSetTopStatus({ topStatus: 'CANCEL' });
      else useSetBottomStatus({ bottomStatus: 'CANCEL' });
      setCardStatus('CANCEL');
      handleSetDefaultCard();
    }
  };

  /**
   * 카드 클릭
   * @returns {void}
   */
  const handleClick = (): void => {
    if (!!form.isSwiped) return; // 드래그 중일시 클릭 무시

    callCustomAlert(color);

    if (position === 'top') useSetTopStatus({ topStatus: 'CLICK' });
    else useSetBottomStatus({ bottomStatus: 'CLICK' });
    setCardStatus('CLICK');
  };

  /**
   * 카드 제거 애니메이션 실행 후 onResetCard 호출
   */
  const handleRemoveCardWithAnimation = (
    position: CardPositionType,
    direction: 1 | -1, // 1: right, -1: left
  ) => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    // transform + opacity transition 적용
    card.style.transform = `translateX(${direction * width * 2}px)`;
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    card.style.opacity = '0';

    // transition 끝난 후 transitionend 이벤트 제거 및 onResetCard 실행
    const handleTransitionEnd = () => {
      card.removeEventListener('transitionend', handleTransitionEnd);
      cardRef.current = null;
      onResetCard(position);
    };

    // transition 끝난 후 이벤트 실행
    card.addEventListener('transitionend', handleTransitionEnd);
  };

  /**
   * 카드 제자리 애니메이션
   * @returns {void}
   */
  const handleSetDefaultCard = (): void => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    // transform + opacity transition 적용
    card.style.transform = `translateX(0px)`;
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    card.style.opacity = '1';

    // transition 끝난 후 transitionend 이벤트 제거
    const handleTransitionEnd = () => {
      card.removeEventListener('transitionend', handleTransitionEnd);
    };

    // transition 끝난 후 이벤트 실행
    card.addEventListener('transitionend', handleTransitionEnd);
  };

  /**
   * 카드 움직일 때 애니메이션 적용
   * @param {number} dx 카드 이동거리
   * @returns {void}
   */
  const handleSetMovingCard = (dx: number): void => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    card.style.transform = `translateX(${dx}px)`;
    card.style.transition = 'none';
    card.style.opacity = `${1 - Math.min(Math.abs(dx) / (width * 2), 1)}`;

    const handleTransitionEnd = () => {
      card.removeEventListener('transitionend', handleTransitionEnd);
    };

    // transition 끝난 후 이벤트 실행
    card.addEventListener('transitionend', handleTransitionEnd);
  };

  const hadleMouseDown = (e: React.MouseEvent) => handleDown(e.clientX);
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleMouseUp = (e: React.MouseEvent) => handleUp(e.clientX);
  const handleTouchStart = (e: React.TouchEvent) =>
    handleDown(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    handleMove(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) =>
    handleUp(e.changedTouches[0].clientX);

  return (
    <div
      className={styles.wrap}
      ref={cardRef}
      style={{
        width,
        height,
        background: color,
        zIndex: idx,
      }}
      onClick={handleClick}
      onMouseDown={hadleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {color}
    </div>
  );
}

interface CardProps extends CommonState {
  position: CardPositionType;
  color: string;
  width: number;
  height: number;
  idx: number;
  onResetCard: (pos: CardPositionType) => void;
  useSetTopStatus: (payload: { topStatus: CardStatusType }) => void;
  useSetBottomStatus: (payload: { bottomStatus: CardStatusType }) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);
