import React, { useEffect, useRef } from 'react';
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
  const cardStatus = useRef<CardStatusType>('AUTO TRANSITION'); // 카드 상태
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

    if (
      cardStatus.current === 'SWIPE LEFT' ||
      cardStatus.current === 'SWIPE RIGHT'
    ) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    } else if (cardStatus.current === 'AUTO TRANSITION') {
      timeoutRef.current = setTimeout(() => {
        onResetCard(position);
      }, AUTO_SWIPE_TIME);
    } else {
      timeoutRef.current = setTimeout(() => {
        if (position === 'top')
          useSetTopStatus({ topStatus: 'AUTO TRANSITION' });
        else useSetBottomStatus({ bottomStatus: 'AUTO TRANSITION' });
        cardStatus.current = 'AUTO TRANSITION';
        onResetCard(position);
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
      isSwiped: false, // 새 스와이프 시작
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

    if (dx > 0) {
      if (position === 'top') useSetTopStatus({ topStatus: 'SWIPE RIGHT' });
      else useSetBottomStatus({ bottomStatus: 'SWIPE RIGHT' });
      cardStatus.current = 'SWIPE RIGHT';
    } else if (dx < 0) {
      if (position === 'top') useSetTopStatus({ topStatus: 'SWIPE LEFT' });
      else useSetBottomStatus({ bottomStatus: 'SWIPE LEFT' });
      cardStatus.current = 'SWIPE LEFT';
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

    // Flip 조건
    if (speed > SPEED_THRESHOLD) {
      onResetCard(position);

      if (+form.translateX > 0) {
        if (position === 'top') useSetTopStatus({ topStatus: 'FLIP RIGHT' });
        else useSetBottomStatus({ bottomStatus: 'FLIP RIGHT' });
        cardStatus.current = 'FLIP RIGHT';
      } else {
        if (position === 'top') useSetTopStatus({ topStatus: 'FLIP LEFT' });
        else useSetBottomStatus({ bottomStatus: 'FLIP LEFT' });
        cardStatus.current = 'FLIP LEFT';
      }
    }
    // 스와이프 거리가 카드의 1/2 이상이면 카드 리셋
    else if (Math.abs(+form.translateX) >= width / 2) {
      onResetCard(position);

      if (+form.translateX > 0) {
        if (position === 'top') useSetTopStatus({ topStatus: 'TO RIGHT' });
        else useSetBottomStatus({ bottomStatus: 'TO RIGHT' });
        cardStatus.current = 'TO RIGHT';
      } else {
        if (position === 'top') useSetTopStatus({ topStatus: 'TO LEFT' });
        else useSetBottomStatus({ bottomStatus: 'TO LEFT' });
        cardStatus.current = 'TO LEFT';
      }
    }
    // 제자리
    else {
      setForm((prevState: KeyValueFormType) => ({
        ...prevState,
        translateX: 0,
      }));

      if (position === 'top') useSetTopStatus({ topStatus: 'CANCEL' });
      else useSetBottomStatus({ bottomStatus: 'CANCEL' });
      cardStatus.current = 'CANCEL';
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
    cardStatus.current = 'CLICK';
  };

  return (
    <div
      className={styles.wrap}
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
