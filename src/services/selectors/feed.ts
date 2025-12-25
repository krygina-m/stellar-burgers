import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const selectFeedState = (state: RootState) => state.feed;

export const selectFeedOrders = createSelector(
  selectFeedState,
  (state) => state.orders
);

export const selectFeedIsLoading = createSelector(
  selectFeedState,
  (state) => state.isLoading
);

export const selectFeedError = createSelector(
  selectFeedState,
  (state) => state.error
);

export const selectFeedTotals = createSelector(selectFeedState, (state) => ({
  total: state.total,
  totalToday: state.totalToday
}));
