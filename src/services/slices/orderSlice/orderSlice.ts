import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi, getOrderByNumberApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../../store/store';

export type TOrderState = {
  order: TOrder | null;
  orderNumber: number | null;
  orderRequest: boolean;
  error: string | null;
};

export const initialState: TOrderState = {
  orderRequest: false,
  orderNumber: null,
  order: null,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  { state: RootState; rejectValue: string }
>('order/create', async (_, { getState, rejectWithValue }) => {
  const state = getState();
  const { bun, ingredients } = state.burgerConstructor;
  if (!bun) {
    return rejectWithValue('Булка не выбрана');
  }
  try {
    const ingredientIds = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];
    const orderResponse = await orderBurgerApi(ingredientIds);
    if (!orderResponse.success) {
      return rejectWithValue('Не удалось оформить заказ');
    }
    return orderResponse.order;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message || 'Ошибка оформления заказа';
    return rejectWithValue(errorMessage);
  }
});

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { state: RootState; rejectValue: string }
>('order/getOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const data = await getOrderByNumberApi(orderNumber);
    if (!data.success) {
      return rejectWithValue('Ошибка загрузки');
    }
    return data.orders[0];
  } catch (error) {
    const errorMessage = (error as { message?: string }).message || 'Ошибка';
    return rejectWithValue(errorMessage);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderNumber = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload;
        state.orderNumber = action.payload.number;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Не удалось оформить заказ';
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })

      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.payload || 'Ошибка загрузки';
      })

      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload;
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
