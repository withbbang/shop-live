import { createSlice } from '@reduxjs/toolkit';
import { CardsStatusType, CardStatusType } from 'utils/types';

export interface CommonState {
  cardsStatus?: CardsStatusType;
}

export const initialState: CommonState = {
  cardsStatus: { top: 'AUTO TRANSITION', bottom: 'AUTO TRANSITION' },
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    useSetCardsStatus(
      state: CommonState,
      action: {
        payload: { position: 'top' | 'bottom'; cardsStatus: CardStatusType };
      },
    ) {
      if (state.cardsStatus) {
        state.cardsStatus[action.payload.position] = action.payload.cardsStatus;
      }
    },
  },
});

export const { useSetCardsStatus } = commonSlice.actions;

export default commonSlice.reducer;
