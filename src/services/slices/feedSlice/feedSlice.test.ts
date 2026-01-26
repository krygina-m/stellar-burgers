jest.mock('../../../utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

import { fetchFeed, feedReducer, initialState, TFeedState } from './feedSlice';
import { TOrdersData } from '@utils-types';
import { getFeedsApi } from '../../../utils/burger-api';

// Mock
const mockApiResponse: TOrdersData = {
  orders: [
    {
      _id: '1',
      ingredients: ['bun'],
      status: 'done',
      name: 'Бургер',
      number: 1,
      createdAt: '2025-21-01',
      updatedAt: '2025-21-01'
    }
  ],
  total: 100,
  totalToday: 1
};

describe('Тест слайса feedSlice', () => {
  let state: TFeedState;

  beforeEach(() => {
    state = { ...initialState };
  });

  it('Проверка начального состояния', () => {
    const init = feedReducer(undefined, { type: '' });
    expect(init).toEqual(initialState);
  });

  it('Проверка при pending: устанавливает isLoading = true и сбрасывает error', () => {
    const action = { type: fetchFeed.pending.type };
    const newState = feedReducer(state, action);
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('Проверка при fulfilled: обновляет состояние с данными из API', () => {
    const action = {
      type: fetchFeed.fulfilled.type,
      payload: mockApiResponse
    };
    const newState = feedReducer(state, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeNull();
    expect(newState.orders).toEqual(mockApiResponse.orders);
    expect(newState.total).toBe(mockApiResponse.total);
    expect(newState.totalToday).toBe(mockApiResponse.totalToday);
  });

  it('Проверка при rejected: устанавливает error при ошибке', () => {
    const errorMessage = 'Ошибка загрузки ленты заказов';
    const action = {
      type: fetchFeed.rejected.type,
      payload: errorMessage
    };
    const newState = feedReducer(state, action);
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(errorMessage);
  });

  it('Дефолтное сообщение, если payload отсутствует', () => {
    const action = {
      type: fetchFeed.rejected.type,
      payload: undefined
    };
    const newState = feedReducer(state, action);
    expect(newState.error).toBe('Не удалось загрузить ленту заказов');
  });

  describe('Асинхронное действие fetchFeed', () => {
    it('Успешно загружает данные', async () => {
      (getFeedsApi as jest.Mock).mockResolvedValue(mockApiResponse);

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchFeed()(dispatch, getState, undefined);

      expect(result.type).toBe(fetchFeed.fulfilled.type);
      expect(result.payload).toEqual(mockApiResponse);
    });

    it('Обрабатывает ошибку при неудачном запросе', async () => {
      const errorMessage = 'Network error';
      (getFeedsApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const getState = jest.fn();
      const result = await fetchFeed()(dispatch, getState, undefined);

      expect(result.type).toBe(fetchFeed.rejected.type);
      expect((result as any).payload).toBe(errorMessage);
    });
  });
});
