import React from 'react';
import { Card } from 'utils/types';
import styles from './Index.module.scss';

function IndexPT({ topCards, bottomCards }: IndexPTProps): React.JSX.Element {
  return <div className={styles.wrap}></div>;
}

interface IndexPTProps {
  topCards: Card[];
  bottomCards: Card[];
}

export default IndexPT;
