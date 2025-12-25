import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '../store';

export const selectIngredientsState = (state: RootState) => state.ingredients;

export const selectIngredients = createSelector(
  selectIngredientsState,
  (state) => state.items
);

export const selectIsIngredientsLoading = createSelector(
  selectIngredientsState,
  (state) => state.isLoading
);

export const selectIngredientsError = createSelector(
  selectIngredientsState,
  (state) => state.error
);

export const selectBuns = createSelector(selectIngredients, (items) =>
  items.filter((item) => item.type === 'bun')
);

export const selectMains = createSelector(selectIngredients, (items) =>
  items.filter((item) => item.type === 'main')
);

export const selectSauces = createSelector(selectIngredients, (items) =>
  items.filter((item) => item.type === 'sauce')
);
