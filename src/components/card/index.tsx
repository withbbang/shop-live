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
  const startXRef = useRef(0); // Flip을 위한 스와이프 시작 위치
  const startTimeRef = useRef(0); // Flip을 위한 스와이프 시작 시간
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
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
        handleRemoveCardWithAnimation(position);
      }, AUTO_SWIPE_TIME);
    }

    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    };
  }, [idx, cardStatus]);

  /**
   * 스와이프 시작
   * @param {React.MouseEvent} e 마우스 이벤트
   * @returns {void}
   */
  const handleDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    startTimeRef.current = Date.now();

    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      isSwiping: true,
      isSwiped: false,
      startX: e.clientX,
    }));
  };

  /**
   * 스와이프 중
   * @param {React.MouseEvent} e 마우스 이벤트
   * @returns {void}
   */
  const handleMove = (e: React.MouseEvent) => {
    if (!!!form.isSwiping) return;

    const dx = e.clientX - +form.startX;

    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      translateX: dx,
      isSwiped: Math.abs(dx) > 3 ? true : false,
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
    }
  };

  /**
   * 스와이프 종료
   * @returns {void}
   */
  const handleUp = (e: React.MouseEvent) => {
    const endX = e.clientX; // 스와이프 종료 X 좌표
    const endTime = Date.now(); // 스와이프 종료 시간

    const dragDistance = endX - startXRef.current; // 스와이프 이동 거리
    const duration = endTime - startTimeRef.current; // 스와이프 동안 걸린 시간
    const speed = Math.abs(dragDistance) / duration; // 스와이프 속도 px/ms

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
      if (+form.translateX > 0) {
        if (position === 'top') useSetTopStatus({ topStatus: 'FLIP RIGHT' });
        else useSetBottomStatus({ bottomStatus: 'FLIP RIGHT' });
        setCardStatus('FLIP RIGHT');
      } else {
        if (position === 'top') useSetTopStatus({ topStatus: 'FLIP LEFT' });
        else useSetBottomStatus({ bottomStatus: 'FLIP LEFT' });
        setCardStatus('FLIP LEFT');
      }

      onResetCard(position);
    } else if (Math.abs(+form.translateX) >= width / 2) {
      if (+form.translateX > 0) {
        if (position === 'top') useSetTopStatus({ topStatus: 'TO RIGHT' });
        else useSetBottomStatus({ bottomStatus: 'TO RIGHT' });
        setCardStatus('TO RIGHT');
      } else {
        if (position === 'top') useSetTopStatus({ topStatus: 'TO LEFT' });
        else useSetBottomStatus({ bottomStatus: 'TO LEFT' });
        setCardStatus('TO LEFT');
      }

      onResetCard(position);
    } else {
      setForm((prevState: KeyValueFormType) => ({
        ...prevState,
        translateX: 0,
      }));

      if (position === 'top') useSetTopStatus({ topStatus: 'CANCEL' });
      else useSetBottomStatus({ bottomStatus: 'CANCEL' });
      setCardStatus('CANCEL');
    }
  };

  /**
   * 카드 클릭
   * @returns {void}
   */
  const handleClick = () => {
    if (!!form.isSwiped) return; // 드래그 중일시 클릭 무시

    callCustomAlert(color);

    if (position === 'top') useSetTopStatus({ topStatus: 'CLICK' });
    else useSetBottomStatus({ bottomStatus: 'CLICK' });
    setCardStatus('CLICK');
  };

  /**
   * 카드 제거 애니메이션 실행 후 onResetCard 호출
   */
  const handleRemoveCardWithAnimation = (position: CardPositionType) => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    // transform + opacity transition 적용
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    card.style.transform = `translateX(${width}px)`;
    card.style.opacity = '0';

    // transition 끝난 후 onResetCard 실행
    const handleTransitionEnd = () => {
      card.removeEventListener('transitionend', handleTransitionEnd);
      onResetCard(position);
    };

    card.addEventListener('transitionend', handleTransitionEnd);
  };

  return (
    <div
      className={styles.wrap}
      ref={cardRef}
      style={{
        transform: `translateX(${+form.translateX}px)`,
        transition: !!form.isSwiping ? 'none' : 'transform 0.3s ease',
        opacity: 1 - Math.min(Math.abs(+form.translateX) / 300, 1),
        width,
        height,
        background: color,
        zIndex: idx,
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
