import React from 'react';
import styles from './Index.module.scss';

function IndexPT({}: IndexPTProps): React.JSX.Element {
  return (
    <div className={styles.wrap}>
      <h1>Index Page</h1>
    </div>
  );
}

interface IndexPTProps {}

export default IndexPT;
