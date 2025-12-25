import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { selectFeedOrders } from './feed';

export const selectUserOrdersState = (state: RootState) => state.userOrders;

export const selectUserOrders = createSelector(
  selectUserOrdersState,
  (state) => state.orders
);

export const selectUserOrdersIsLoading = createSelector(
  selectUserOrdersState,
  (state) => state.isLoading
);

export const selectUserOrdersError = createSelector(
  selectUserOrdersState,
  (state) => state.error
);

export const selectAllOrders = createSelector(
  selectFeedOrders,
  selectUserOrders,
  (feedOrders, userOrders) => {
    const all = [...feedOrders];
    const existingNumbers = new Set(feedOrders.map((order) => order.number));

    userOrders.forEach((order) => {
      if (!existingNumbers.has(order.number)) {
        all.push(order);
      }
    });

    return all;
  }
);
