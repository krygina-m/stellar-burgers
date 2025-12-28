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

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        const { id, ...bunData } = ingredient;
        state.bun = bunData as TIngredient;
      } else {
        state.ingredients.push(ingredient);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      // Проверяем, можно ли сдвинуть вверх (не первый элемент и индекс в пределах массива)
      if (index <= 0 || index >= state.ingredients.length) return;

      [state.ingredients[index - 1], state.ingredients[index]] = [
        state.ingredients[index],
        state.ingredients[index - 1]
      ];
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      // Проверяем, можно ли сдвинуть вниз (не последний элемент и корректный индекс)
      if (index < 0 || index >= state.ingredients.length - 1) return;

      [state.ingredients[index], state.ingredients[index + 1]] = [
        state.ingredients[index + 1],
        state.ingredients[index]
      ];
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
