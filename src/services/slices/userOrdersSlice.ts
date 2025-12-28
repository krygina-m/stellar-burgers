import {
  createAsyncThunk,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';
import { selectFeedOrders } from './feedSlice';

export type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

// Асинхронный thunk для загрузки заказов пользователя
export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('userOrders/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message ||
      'Ошибка загрузки заказов пользователя';
    return rejectWithValue(errorMessage);
  }
});

// Слайс с встроенными селекторами
const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    // Полное состояние слайса
    selectUserOrdersState: (state) => state,

    // Список заказов
    selectUserOrders: (state) => state.orders,

    // Статус загрузки
    selectUserOrdersIsLoading: (state) => state.isLoading,

    // Ошибка
    selectUserOrdersError: (state) => state.error,

    // Количество заказов
    selectUserOrdersCount: (state) => state.orders.length,

    // Проверка, есть ли заказы
    selectHasOrders: (state) => state.orders.length > 0
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Не удалось загрузить заказы пользователя';
      });
  }
});

// Экспорт редуктора
export const userOrdersReducer = userOrdersSlice.reducer;

// Экспорт встроенных селекторов
export const {
  selectUserOrdersState,
  selectUserOrders,
  selectUserOrdersIsLoading,
  selectUserOrdersError,
  selectUserOrdersCount,
  selectHasOrders
} = userOrdersSlice.selectors;

// Сложный селектор (зависит от другого слайса)
export const selectAllOrders = createSelector(
  // Зависимости: селекторы из других слайсов
  [
    (state: RootState) => selectFeedOrders(state), // из feedSlice
    selectUserOrders // из текущего слайса (уже мемоизирован)
  ],
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
