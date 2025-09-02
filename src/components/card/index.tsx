import React, { useEffect, useRef } from 'react';
import { PropState } from 'middlewares/configureReducer';
import { connect } from 'react-redux';
import {
  CommonState,
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
      dispatch(useSetTopStatus(payload));
    },
  };
};

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
    isSwiped: false, // 스와이프 여부 추적
    startX: 0, // 스와이프 시작 위치
    translateX: 0, // 스와이프 이동 거리
  });

  useEffect(() => {
    if (cardRef.current && idx === 0) {
      //TODO: 3초간 아무런 동작 없을 시 AUTO TRANSITION 모드로 진행하도록 세팅
    }
  }, [cardRef]);

  /**
   * 클릭/터치 시작
   * @param {React.MouseEvent} e 마우스 이벤트
   * @returns {void}
   */
  const handleDown = (e: React.MouseEvent) => {
    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      isSwiping: true,
      isSwiped: false, // 새 스와이프 시작
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

    const dx = e.clientX - +form.startX;

    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      translateX: dx,
      isSwiped: Math.abs(dx) > 3 ? true : false,
    }));
  };

  /**
   * 클릭/터치 종료
   * @returns {void}
   */
  const handleUp = () => {
    setForm((prevState: KeyValueFormType) => ({
      ...prevState,
      isSwiping: false,
    }));

    if (Math.abs(+form.translateX) >= width / 2)
      onResetCard(position); // 스와이프 거리가 카드의 1/2 이상이면 카드 리셋
    else
      setForm((prevState: KeyValueFormType) => ({
        ...prevState,
        translateX: 0,
      }));
  };

  /**
   * 카드 클릭
   * @returns {void}
   */
  const handleClick = () => {
    if (!!form.isSwiped) return; // 드래그 중일시 클릭 무시
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

interface CardProps extends CommonState {
  position: CardPositionType;
  color: string;
  width: number;
  height: number;
  idx: number;
  onResetCard: (pos: CardPositionType) => void;
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);
