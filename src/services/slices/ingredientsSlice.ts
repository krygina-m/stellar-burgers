import {
  createAsyncThunk,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

export type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message || 'Ошибка загрузки ингредиентов';
    return rejectWithValue(errorMessage);
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    // Базовый селектор состояния слайса
    selectIngredientsState: (state) => state,

    // Извлечение списка ингредиентов
    selectIngredients: (state) => state.items,

    // Статус загрузки
    selectIsIngredientsLoading: (state) => state.isLoading,

    // Ошибка
    selectIngredientsError: (state) => state.error,

    // Фильтрация по типу: булки
    selectBuns: (state) => state.items.filter((item) => item.type === 'bun'),

    // Фильтрация по типу: основные ингредиенты
    selectMains: (state) => state.items.filter((item) => item.type === 'main'),

    // Фильтрация по типу: соусы
    selectSauces: (state) => state.items.filter((item) => item.type === 'sauce')
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Не удалось загрузить ингредиенты';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;

// Экспорт селекторов
export const {
  selectIngredientsState,
  selectIngredients,
  selectIsIngredientsLoading,
  selectIngredientsError,
  selectBuns,
  selectMains,
  selectSauces
} = ingredientsSlice.selectors;
