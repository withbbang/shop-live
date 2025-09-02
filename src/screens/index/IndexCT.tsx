import React, { useEffect, useState } from 'react';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import { CardType, CardPositionType } from 'utils/types';
import { createCard } from 'utils/utils';
import { useChangeHook } from 'utils/hooks';
import IndexPT from './IndexPT';

function IndexCT({}: IndexCTProps): React.JSX.Element {
  const [topCards, setTopCards] = useState<CardType[]>([]); // 위 카드 리스트
  const [bottomCards, setBottomCards] = useState<CardType[]>([]); // 아래 카드 리스트
  const { form, setForm } = useChangeHook({
    topStatus: 'AUTO TRANSITION', // 위 카드 상태
    bottomStatus: 'AUTO TRANSITION', // 아래 카드 상태
  });

  useEffect(() => {
    // 카드 초기화
    [0, 0].forEach((_, idx) => {
      setTopCards((prev) => [...prev, createCard()]);
      setBottomCards((prev) => [...prev, createCard()]);
    });
  }, []);

  /**
   * 카드 제거 및 카드 생성
   * @param {CardPositionType} pos 카드 위치
   */
  const handleResetCard = (pos: CardPositionType) => {
    if (pos === 'top') setTopCards((prev) => [createCard(), { ...prev[0] }]);
    else setBottomCards((prev) => [createCard(), { ...prev[0] }]);
  };

  return (
    <IndexPT
      topCards={topCards}
      bottomCards={bottomCards}
      onResetCard={handleResetCard}
    />
  );
}

interface IndexCTProps extends CommonState {}

export default IndexCT;
