import React from 'react';
import { CardPositionType, CardStatusType, CardType } from 'utils/types';
import CardBox from 'components/cardBox';
import {
  BOTTOM_CARD_HEIGHT,
  BOTTOM_CARD_WIDTH,
  TOP_CARD_HEIGHT,
  TOP_CARD_WIDTH,
} from 'utils/constants';
import styles from './Index.module.scss';

function IndexPT({
  topStatus,
  bottomStatus,
  topCards,
  bottomCards,
  onResetCard,
}: IndexPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <p>{topStatus}</p>
      <CardBox
        position={'top'}
        cards={topCards}
        width={TOP_CARD_WIDTH}
        height={TOP_CARD_HEIGHT}
        onResetCard={onResetCard}
      />
      <br />
      <p>{bottomStatus}</p>
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
  topStatus?: CardStatusType;
  bottomStatus?: CardStatusType;
  topCards: CardType[];
  bottomCards: CardType[];
  onResetCard: (pos: CardPositionType) => void;
}

export default IndexPT;
