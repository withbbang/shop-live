import React from 'react';
import { CardPositionType, CardType } from 'utils/types';
import Card from 'components/card';
import styles from './CardBox.module.scss';

function CardBox({
  position,
  cards,
  width,
  height,
  onResetCard,
}: CardBoxProps): React.JSX.Element {
  return (
    <div className={styles.wrap} style={{ height: `${height}px` }}>
      {cards.map(({ id, color }: CardType, idx) => (
        <Card
          key={id}
          position={position}
          width={width}
          height={height}
          color={color}
          idx={idx}
          onResetCard={onResetCard}
        />
      ))}
    </div>
  );
}

interface CardBoxProps {
  position: CardPositionType;
  cards: CardType[];
  width: number;
  height: number;
  onResetCard: (pos: CardPositionType) => void;
}

export default CardBox;
