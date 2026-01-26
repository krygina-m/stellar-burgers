jest.mock('../../../utils/burger-api', () => ({
  getOrdersApi: jest.fn()
}));

import {
  fetchUserOrders,
  userOrdersReducer,
  initialState,
  TUserOrdersState
} from './userOrdersSlice';

import { TOrder } from '@utils-types';

// Моки
const mockApiResponse: TOrder[] = [
  {
    _id: 'order1',
    ingredients: ['60d3b41abdacab0026a733c7', '60d3b41abdacab0026a733c8'],
    status: 'done',
    name: 'Флюоресцентный бургер',
    number: 1,
    createdAt: '2026-01-21T12:00:00.000Z',
    updatedAt: '2026-01-21T12:00:00.000Z'
  },
  {
    _id: 'order2',
    ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c9'],
    status: 'pending',
    name: 'Краторный бургер',
    number: 2,
    createdAt: '2026-01-21T13:00:00.000Z',
    updatedAt: '2026-01-21T13:00:00.000Z'
  },
  {
    _id: 'order3',
    ingredients: [
      '60d3b41abdacab0026a733c6',
      '60d3b41abdacab0026a733c8',
      '60d3b41abdacab0026a733cc'
    ],
    status: 'done',
    name: 'Space бургер',
    number: 3,
    createdAt: '2026-01-21T10:00:00.000Z',
    updatedAt: '2026-01-21T10:00:00.000Z'
  }
];

import { getOrdersApi } from '../../../utils/burger-api';

describe('Тест слайса userOrdersSlice', () => {
  let state: TUserOrdersState;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('Начальное состояние', () => {
    it('должно иметь корректное начальное состояние', () => {
      const init = userOrdersReducer(undefined, { type: '' });
      expect(init).toEqual(initialState);
    });
  });

  describe('fetchUserOrders.pending', () => {
    it('устанавливает isLoading = true и сбрасывает error', () => {
      const action = { type: fetchUserOrders.pending.type };
      const newState = userOrdersReducer(state, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });
  });

  describe('fetchUserOrders.fulfilled', () => {
    it('обновляет состояние с данными из ответа API', () => {
      const action = {
        type: fetchUserOrders.fulfilled.type,
        payload: mockApiResponse
      };
      const newState = userOrdersReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.orders).toEqual(mockApiResponse);
    });
  });

  describe('fetchUserOrders.rejected', () => {
    it('устанавливает error при ошибке', () => {
      const errorMessage = 'Ошибка загрузки заказов пользователя';
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: errorMessage
      };
      const newState = userOrdersReducer(state, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });

    it('использует дефолтное сообщение, если payload отсутствует', () => {
      const action = {
        type: fetchUserOrders.rejected.type,
        payload: undefined
      };
      const newState = userOrdersReducer(state, action);

      expect(newState.error).toBe('Не удалось загрузить заказы пользователя');
    });
  });

  describe('Асинхронное действие fetchUserOrders', () => {
    let dispatch: jest.Mock;
    let getState: jest.Mock;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('успешно загружает заказы', async () => {
      (getOrdersApi as jest.Mock).mockResolvedValue(mockApiResponse);

      const result = await fetchUserOrders()(dispatch, getState, undefined);
      expect(result.type).toBe(fetchUserOrders.fulfilled.type);
      expect(result.payload).toEqual(mockApiResponse);
    });

    it('обрабатывает ошибку при неудачном запросе', async () => {
      const errorMessage = 'Network error';
      (getOrdersApi as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const result = await fetchUserOrders()(dispatch, getState, undefined);
      expect(result.type).toBe(fetchUserOrders.rejected.type);
      expect((result as any).payload).toBe(errorMessage);
    });
  });
});
