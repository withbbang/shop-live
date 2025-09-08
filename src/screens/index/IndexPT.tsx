import React from 'react';
import { CardPositionType, CardsStatusType, CardType } from 'utils/types';
import CardBox from 'components/cardBox';
import {
  BOTTOM_CARD_HEIGHT,
  BOTTOM_CARD_WIDTH,
  TOP_CARD_HEIGHT,
  TOP_CARD_WIDTH,
} from 'utils/constants';
import styles from './Index.module.scss';

function IndexPT({
  cardsStatus,
  topCards,
  bottomCards,
  onResetCard,
}: IndexPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <p>{cardsStatus?.top}</p>
        <CardBox
          position={'top'}
          cards={topCards}
          width={TOP_CARD_WIDTH}
          height={TOP_CARD_HEIGHT}
          onResetCard={onResetCard}
        />
      </div>
      <br />
      <br />
      <div className={styles.box}>
        <p>{cardsStatus?.bottom}</p>
        <CardBox
          position={'bottom'}
          cards={bottomCards}
          width={BOTTOM_CARD_WIDTH}
          height={BOTTOM_CARD_HEIGHT}
          onResetCard={onResetCard}
        />
      </div>
    </div>
  );
}

interface IndexPTProps {
  cardsStatus?: CardsStatusType;
  topCards: CardType[];
  bottomCards: CardType[];
  onResetCard: (pos: CardPositionType) => void;
}

export default IndexPT;
