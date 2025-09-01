import React, { useEffect } from 'react';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import IndexPT from './IndexPT';

function IndexCT({}: IndexCTProps): React.JSX.Element {
  useEffect(() => {}, []);
  return <IndexPT />;
}

interface IndexCTProps extends CommonState {}

export default IndexCT;
