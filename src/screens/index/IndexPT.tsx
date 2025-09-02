import React from 'react';
import { CardPositionType, CardType } from 'utils/types';
import CardBox from 'components/cardBox';
import styles from './Index.module.scss';
import {
  BOTTOM_CARD_HEIGHT,
  BOTTOM_CARD_WIDTH,
  TOP_CARD_HEIGHT,
  TOP_CARD_WIDTH,
} from 'utils/constants';

function IndexPT({
  topCards,
  bottomCards,
  onResetCard,
}: IndexPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <CardBox
        position={'top'}
        cards={topCards}
        width={TOP_CARD_WIDTH}
        height={TOP_CARD_HEIGHT}
        onResetCard={onResetCard}
      />
      <br />
      <CardBox
        position={'bottom'}
        cards={bottomCards}
        width={BOTTOM_CARD_WIDTH}
        height={BOTTOM_CARD_HEIGHT}
        onResetCard={onResetCard}
      />
    </div>
  );
}

interface IndexPTProps {
  topCards: CardType[];
  bottomCards: CardType[];
  onResetCard: (pos: CardPositionType) => void;
}

export default IndexPT;
