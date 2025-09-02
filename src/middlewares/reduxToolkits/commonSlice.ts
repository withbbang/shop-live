import { createSlice } from '@reduxjs/toolkit';
import { CardStatusType } from 'utils/types';

export interface CommonState {
  topStatus?: CardStatusType;
  bottomStatus?: CardStatusType;
}

export const initialState: CommonState = {
  topStatus: 'AUTO TRANSITION',
  bottomStatus: 'AUTO TRANSITION',
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    useSetTopStatus(state: CommonState, action) {
      state.topStatus = action.payload.topStatus;
    },
    useSetBottomStatus(state: CommonState, action) {
      state.bottomStatus = action.payload.bottomStatus;
    },
  },
});

export const { useSetTopStatus, useSetBottomStatus } = commonSlice.actions;

export default commonSlice.reducer;
