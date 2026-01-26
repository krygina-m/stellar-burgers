// Моки
jest.mock('../../../utils/burger-api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

import {
  userReducer,
  initialState,
  TUserState,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logout,
  selectUser,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectUserError
} from './userSlice';

import { TUser } from '@utils-types';

// Моковые данные
const mockUser: TUser = {
  email: 'test@mail.ru',
  name: 'Тестовый Пользователь'
};

describe('Тест слайса userSlice', () => {
  let state: TUserState;

  beforeEach(() => {
    state = { ...initialState };
  });

  it('начальное состояние должно быть корректным', () => {
    const init = userReducer(undefined, { type: '' });
    expect(init).toEqual(initialState);
  });

  describe('registerUser', () => {
    it('pending устанавливает isLoading=true и сбрасывает error', () => {
      const action = { type: registerUser.pending.type };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fulfilled обновляет user и устанавливает isAuthChecked=true', () => {
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('rejected устанавливает error и isAuthChecked=true', () => {
      const errorMessage = 'Не удалось зарегистрировать пользователя';
      const action = {
        type: registerUser.rejected.type,
        payload: errorMessage
      };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.isAuthChecked).toBe(true);
    });

    it('rejected с отсутствующим payload использует дефолтное сообщение', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: undefined
      };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Не удалось зарегистрировать пользователя');
    });
  });

  describe('loginUser', () => {
    it('pending устанавливает isLoading=true и сбрасывает error', () => {
      const action = { type: loginUser.pending.type };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fulfilled обновляет user и устанавливает isAuthChecked=true', () => {
      const action = {
        type: loginUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('rejected устанавливает error и isAuthChecked=true', () => {
      const errorMessage = 'Не удалось авторизоваться';
      const action = {
        type: loginUser.rejected.type,
        payload: errorMessage
      };
      const newState = userReducer(state, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.isAuthChecked).toBe(true);
    });

    it('rejected с отсутствующим payload использует дефолтное сообщение', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: undefined
      };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Не удалось авторизоваться');
    });
  });

  describe('getUser', () => {
    it('pending устанавливает isLoading=true и сбрасывает error', () => {
      const action = { type: getUser.pending.type };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fulfilled обновляет user и устанавливает isAuthChecked=true', () => {
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('rejected устанавливает error и isAuthChecked=true', () => {
      const errorMessage = 'Не удалось получить данные пользователя';
      const action = {
        type: getUser.rejected.type,
        payload: errorMessage
      };
      const newState = userReducer(state, action);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.isAuthChecked).toBe(true);
    });

    it('rejected с отсутствующим payload использует дефолтное сообщение', () => {
      const action = {
        type: getUser.rejected.type,
        payload: undefined
      };
      const newState = userReducer(state, action);
      expect(newState.error).toBe('Не удалось получить данные пользователя');
    });
  });

  describe('updateUser', () => {
    it('pending устанавливает isLoading=true и сбрасывает error', () => {
      const action = { type: updateUser.pending.type };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fulfilled обновляет user', () => {
      const action = {
        type: updateUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.user).toEqual(mockUser);
      expect(newState.error).toBeNull();
    });

    it('rejected устанавливает error', () => {
      const errorMessage = 'Не удалось обновить данные пользователя';
      const action = {
        type: updateUser.rejected.type,
        payload: errorMessage
      };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });

    it('rejected с отсутствующим payload использует дефолтное сообщение', () => {
      const action = {
        type: updateUser.rejected.type,
        payload: undefined
      };
      const newState = userReducer(state, action);

      expect(newState.error).toBe('Не удалось обновить данные пользователя');
    });
  });

  describe('logout', () => {
    it('pending устанавливает isLoading=true и сбрасывает error', () => {
      const action = { type: logout.pending.type };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('fulfilled очищает user и устанавливает isAuthChecked=true', () => {
      const action = { type: logout.fulfilled.type };
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.user).toBeNull();
      expect(newState.isAuthChecked).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('rejected устанавливает error и оставляет isAuthChecked=true', () => {
      const errorMessage = 'Не удалось выйти из аккаунта';
      const action = {
        type: logout.rejected.type,
        payload: errorMessage
      };
      state.isAuthChecked = true;
      const newState = userReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.isAuthChecked).toBe(true);
    });
  });

  describe('тест селекторов', () => {
    it('тест selectUser', () => {
      const state = { user: initialState };
      const result = selectUser(state);
      expect(result).toBeNull;
    });

    it('тест selectIsAuthChecked', () => {
      const state = { user: initialState };
      const result = selectIsAuthChecked(state);
      expect(result).toBe(false);
    });

    it('тест selectIsAuthenticated', () => {
      const state = { user: initialState };
      const result = selectIsAuthenticated(state);
      expect(result).toBe(false);
    });

    it('тест selectUserError', () => {
      const state = { user: initialState };
      const result = selectUserError(state);
      expect(result).toBe(null);
    });
  });
});
