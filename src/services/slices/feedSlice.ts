import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

// Асинхронный thunk для загрузки ленты заказов
export const fetchFeed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feed/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message ||
      'Ошибка загрузки ленты заказов';
    return rejectWithValue(errorMessage);
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Не удалось загрузить ленту заказов';
      });
  }
});

// Экспорт редуктора
export const feedReducer = feedSlice.reducer;
