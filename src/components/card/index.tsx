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
import { AUTO_SWIPE_TIME } from 'utils/constants';
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
  const [topTimeout, setTopTimeout] = useState<NodeJS.Timeout | null>(null);
  const [topInterval, setTopInterval] = useState<NodeJS.Timeout | null>(null);
  const [bottomTimeout, setBottomTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [bottomInterval, setBottomInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const { form, setForm } = useChangeHook({
    isSwiping: false, // 스와이프 진행 여부
    isSwiped: false, // 스와이프 여부 추적
    startX: 0, // 스와이프 시작 위치
    translateX: 0, // 스와이프 이동 거리
  });

  /**
   * 스와이프 시작
   * @param {React.MouseEvent} e 마우스 이벤트
   * @returns {void}
   */
  const handleDown = (e: React.MouseEvent) => {
    handleClearTimer();

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
    } else if (dx < 0) {
      if (position === 'top') useSetTopStatus({ topStatus: 'SWIPE LEFT' });
      else useSetBottomStatus({ bottomStatus: 'SWIPE LEFT' });
    }
  };

  /**
   * 스와이프 종료
   * @returns {void}
   */
  const handleUp = () => {
    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      isSwiping: false,
    }));

    // 스와이프 거리가 카드의 1/2 이상이면 카드 리셋
    if (Math.abs(+form.translateX) >= width / 2) {
      onResetCard(position);
      if (position === 'top')
        useSetTopStatus({
          topStatus: +form.translateX > 0 ? 'TO RIGHT' : 'TO LEFT',
        });
      else
        useSetBottomStatus({
          bottomStatus: +form.translateX > 0 ? 'TO RIGHT' : 'TO LEFT',
        });
    } else {
      setForm((prevState: KeyValueFormType) => ({
        ...prevState,
        translateX: 0,
      }));
      if (position === 'top') useSetTopStatus({ topStatus: 'CANCEL' });
      else useSetBottomStatus({ bottomStatus: 'CANCEL' });
    }

    handleSetCardDefault();
  };

  /**
   * 카드 클릭
   * @returns {void}
   */
  const handleClick = () => {
    if (!!form.isSwiped) return; // 드래그 중일시 클릭 무시

    handleClearTimer();

    callCustomAlert(color);

    if (position === 'top') useSetTopStatus({ topStatus: 'CLICK' });
    else useSetBottomStatus({ bottomStatus: 'CLICK' });

    handleSetCardDefault();
  };

  /**
   * 3초 후 카드 상태 설정
   */
  const handleSetCardDefault = () => {
    if (position === 'top') {
      const timer = setTimeout(() => {
        useSetTopStatus({ topStatus: 'AUTO TRANSITION' });

        const interval = setInterval(
          () => onResetCard(position),
          AUTO_SWIPE_TIME,
        );

        onResetCard(position);
        setTopInterval(interval);
      }, AUTO_SWIPE_TIME);

      setTopTimeout(timer);
    } else if (position === 'bottom') {
      const timer = setTimeout(() => {
        useSetBottomStatus({ bottomStatus: 'AUTO TRANSITION' });

        const interval = setInterval(
          () => onResetCard(position),
          AUTO_SWIPE_TIME,
        );

        onResetCard(position);
        setBottomInterval(interval);
      }, AUTO_SWIPE_TIME);

      setBottomTimeout(timer);
    }
  };

  /**
   * 타이머 클리어
   */
  const handleClearTimer = () => {
    if (position === 'top') {
      clearTimeout(topTimeout as NodeJS.Timeout);
      clearInterval(topInterval as NodeJS.Timeout);
      setTopTimeout(null);
      setTopInterval(null);
    } else if (position === 'bottom') {
      clearTimeout(bottomTimeout as NodeJS.Timeout);
      clearInterval(bottomInterval as NodeJS.Timeout);
      setBottomTimeout(null);
      setBottomInterval(null);
    }
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
