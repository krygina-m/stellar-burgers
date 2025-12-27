import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const ensureIngredientsArray = (state: TConstructorState) => {
  if (!state.ingredients) {
    state.ingredients = [];
  }
};

// Слайс с встроенными селекторами
const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      ensureIngredientsArray(state);
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        const { id, ...bunData } = ingredient;
        state.bun = bunData as TIngredient;
        return;
      }
      state.ingredients.push(ingredient);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      ensureIngredientsArray(state);
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      ensureIngredientsArray(state);
      const index = action.payload;
      if (index <= 0 || index >= state.ingredients.length) return;
      const ingredients = [...state.ingredients];
      const temp = ingredients[index - 1];
      ingredients[index - 1] = ingredients[index];
      ingredients[index] = temp;
      state.ingredients = ingredients;
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      ensureIngredientsArray(state);
      const index = action.payload;
      if (index < 0 || index >= state.ingredients.length - 1) return;
      const ingredients = [...state.ingredients];
      const temp = ingredients[index + 1];
      ingredients[index + 1] = ingredients[index];
      ingredients[index] = temp;
      state.ingredients = ingredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    // Базовый селектор состояния слайса
    selectConstructorState: (state) => state,

    // Булка
    selectConstructorBun: (state) => state.bun,

    // Список ингредиентов
    selectConstructorIngredients: (state) => state.ingredients,

    // Общее количество элементов (булка + ингредиенты)
    selectTotalItemsCount: (state) =>
      (state.bun ? 1 : 0) + state.ingredients.length,

    // Проверка наличия булки
    selectHasBun: (state) => !!state.bun,

    // Проверка, пуст ли конструктор
    selectIsEmpty: (state) => !state.bun && state.ingredients.length === 0
  }
});

// Экспорт действий и редуктора
export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;

// Экспорт встроенных селекторов
export const {
  selectConstructorState,
  selectConstructorBun,
  selectConstructorIngredients,
  selectTotalItemsCount,
  selectHasBun,
  selectIsEmpty
} = constructorSlice.selectors;

// Сложные селекторы (используем createSelector для оптимизации)
export const selectConstructorCounters = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients) => {
    const counters: { [key: string]: number } = {};

    // Учёт булки (всегда 2 экземпляра)
    if (bun) {
      counters[bun._id] = 2;
    }

    // Учёт остальных ингредиентов
    ingredients.forEach((ingredient) => {
      if (!counters[ingredient._id]) {
        counters[ingredient._id] = 0;
      }
      counters[ingredient._id] += 1;
    });

    return counters;
  }
);
