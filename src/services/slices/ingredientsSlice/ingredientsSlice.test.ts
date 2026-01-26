jest.mock('../../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn(() => Promise.resolve([]))
}));

import {
  ingredientsReducer,
  initialState,
  fetchIngredients,
  TIngredientsState
} from './ingredientsSlice';
import type { TIngredient } from '@utils-types';
import ingredientsMock from './ingredients.json';
import { getIngredientsApi } from '../../../utils/burger-api';

describe('Тест слайса ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = ingredientsMock.data;
  let state: TIngredientsState;

  beforeEach(() => {
    state = { ...initialState };
  });

  it('Тест начального состояния', () => {
    const init = ingredientsReducer(undefined, { type: '' });
    expect(init).toEqual(initialState);
  });

  it('isLoading=true при pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(state, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
    expect(result.items).toEqual([]);
  });

  it('Запись ингридиентов в store при fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const result = ingredientsReducer({ ...state, isLoading: true }, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
    expect(result.items).toEqual(mockIngredients);
  });

  it('Запись ошибки в store при rejected', () => {
    const errorMessage = 'Ошибка сервера';
    const action = {
      type: fetchIngredients.rejected.type,
      payload: errorMessage
    };
    const result = ingredientsReducer({ ...state, isLoading: true }, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
    expect(result.items).toEqual([]);
  });

  it('Должен использовать дефолтное сообщение при отсутствии error.message', async () => {
    const action = {
      type: fetchIngredients.rejected.type
    };
    const result = ingredientsReducer({ ...state, isLoading: true }, action);
    expect(result.error).toBe('Не удалось загрузить ингредиенты');
  });
});

describe('Асинхронное действие fetchIngredients', () => {
  it('Успешно загружает данные', async () => {
    (getIngredientsApi as jest.Mock).mockResolvedValue(ingredientsMock);

    const dispatch = jest.fn();
    const getState = jest.fn();
    const result = await fetchIngredients()(dispatch, getState, undefined);

    expect(result.type).toBe(fetchIngredients.fulfilled.type);
    expect(result.payload).toEqual(ingredientsMock);
  });

  it('Обрабатывает ошибку при неудачном запросе', async () => {
    const errorMessage = 'Network error';
    (getIngredientsApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const dispatch = jest.fn();
    const getState = jest.fn();
    const result = await fetchIngredients()(dispatch, getState, undefined);

    expect(result.type).toBe(fetchIngredients.rejected.type);
    expect((result as any).payload).toBe(errorMessage);
  });
});
