import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (registerData, { rejectWithValue }) => {
  try {
    const registerResponse = await registerUserApi(registerData);
    if (!registerResponse.success) {
      return rejectWithValue('Не удалось зарегистрировать пользователя');
    }
    localStorage.setItem('refreshToken', registerResponse.refreshToken);
    setCookie('accessToken', registerResponse.accessToken);
    return registerResponse.user;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message || 'Ошибка регистрации';
    return rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (loginData, { rejectWithValue }) => {
  try {
    const loginResponse = await loginUserApi(loginData);
    if (!loginResponse.success) {
      return rejectWithValue('Не удалось авторизоваться');
    }
    localStorage.setItem('refreshToken', loginResponse.refreshToken);
    setCookie('accessToken', loginResponse.accessToken);
    return loginResponse.user;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message || 'Ошибка авторизации';
    return rejectWithValue(errorMessage);
  }
});

export const getUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/get',
  async (_, { rejectWithValue }) => {
    try {
      const userResponse = await getUserApi();
      if (!userResponse.success) {
        return rejectWithValue('Не удалось получить данные пользователя');
      }
      return userResponse.user;
    } catch (error) {
      const errorMessage =
        (error as { message?: string }).message ||
        'Ошибка загрузки пользователя';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (userData, { rejectWithValue }) => {
  try {
    const userResponse = await updateUserApi(userData);
    if (!userResponse.success) {
      return rejectWithValue('Не удалось обновить данные пользователя');
    }
    return userResponse.user;
  } catch (error) {
    const errorMessage =
      (error as { message?: string }).message ||
      'Ошибка обновления пользователя';
    return rejectWithValue(errorMessage);
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const logoutResponse = await logoutApi();
      if (!logoutResponse.success) {
        return rejectWithValue('Не удалось выйти из аккаунта');
      }
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      const errorMessage =
        (error as { message?: string }).message || 'Ошибка выхода из аккаунта';
      return rejectWithValue(errorMessage);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Не удалось зарегистрировать пользователя';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Не удалось авторизоваться';
        state.isAuthChecked = true;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Не удалось получить данные пользователя';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || 'Не удалось обновить данные пользователя';
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Не удалось выйти из аккаунта';
      });
  }
});

export const userReducer = userSlice.reducer;
