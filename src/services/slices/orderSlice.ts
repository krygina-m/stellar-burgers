import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export type TOrderState = {
  orderRequest: boolean;
  order: TOrder | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  order: null,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  void,
  { state: RootState; rejectValue: string }
>('order/create', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const { bun, ingredients } = state.burgerConstructor;

    if (!bun) {
      return rejectWithValue('Булка не выбрана');
    }

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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
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
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Не удалось оформить заказ';
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
