import React, { useEffect, useState } from 'react';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import { Card, CardPosition } from 'utils/types';
import { createCard } from 'utils/utils';
import { useChangeHook } from 'utils/hooks';
import IndexPT from './IndexPT';

function IndexCT({}: IndexCTProps): React.JSX.Element {
  const [topCards, setTopCards] = useState<Card[]>([]); // 위 카드 리스트
  const [bottomCards, setBottomCards] = useState<Card[]>([]); // 아래 카드 리스트
  const { form, setForm } = useChangeHook({
    topStatus: 'AUTO TRANSITION', // 위 카드 상태
    bottomStatus: 'AUTO TRANSITION', // 아래 카드 상태
  });

  useEffect(() => {
    // 카드 초기화
    [0, 0].forEach((_, idx) => {
      setTopCards((prev) => [...prev, createCard('top', idx === 0)]);
      setBottomCards((prev) => [...prev, createCard('bottom', idx === 0)]);
    });
  }, []);

  /**
   * 카드 제거 및 카드 생성
   * @param {CardPosition} pos 카드 위치
   */
  const handleResetCard = (pos: CardPosition) => {
    if (pos === 'top')
      setTopCards((prev) => [createCard('top', false), ...prev.slice(1, 1)]);
    else
      setBottomCards((prev) => [
        createCard('bottom', false),
        ...prev.slice(1, 1),
      ]);
  };

  return <IndexPT topCards={topCards} bottomCards={bottomCards} />;
}

interface IndexCTProps extends CommonState {}

export default IndexCT;
