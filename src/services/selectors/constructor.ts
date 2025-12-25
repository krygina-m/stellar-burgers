import { TConstructorState } from '../slices/constructorSlice';
import { RootState } from '../store';

const emptyConstructorState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const selectConstructorState = (state: RootState): TConstructorState =>
  state.burgerConstructor || emptyConstructorState;

export const selectConstructorItems = selectConstructorState;

export const selectConstructorBun = (state: RootState) =>
  selectConstructorState(state).bun;

export const selectConstructorIngredients = (state: RootState) =>
  selectConstructorState(state).ingredients;

export const selectConstructorCounters = (state: RootState) => {
  const counters: { [key: string]: number } = {};

  const constructorState = selectConstructorState(state);

  constructorState.ingredients.forEach((ingredient) => {
    if (!counters[ingredient._id]) {
      counters[ingredient._id] = 0;
    }
    counters[ingredient._id] += 1;
  });

  if (constructorState.bun) {
    counters[constructorState.bun._id] = 2;
  }

  return counters;
};
