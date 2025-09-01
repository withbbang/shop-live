import React from 'react';
import styles from './Loader.module.scss';

function Card({ width, height }: CardProps): React.JSX.Element {
  return <div className={styles.wrap}></div>;
}

interface CardProps {
  width: number;
  height: number;
}

export default Card;
