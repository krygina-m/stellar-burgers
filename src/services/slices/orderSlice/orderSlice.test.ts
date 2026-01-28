// Моки API
jest.mock('../../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

import {
  createOrder,
  getOrderByNumber,
  orderReducer,
  initialState,
  TOrderState
} from './orderSlice';

// Моковые данные
const mockCreateOrderResponse = {
  success: true,
  name: 'Флюоресцентный бургер',
  order: {
    number: 1,
    ingredients: ['bun1', 'main1'],
    _id: 'order1',
    status: 'done',
    name: 'Флюоресцентный бургер',
    createdAt: '2025-12-01',
    updatedAt: '2025-12-01'
  }
};

const mockGetOrderByNumberResponse = {
  success: true,
  orders: [
    {
      number: 2,
      ingredients: ['bun2', 'main2'],
      _id: 'order2',
      status: 'pending',
      name: 'Краторный бургер',
      createdAt: '2025-12-02',
      updatedAt: '2025-12-02'
    }
  ]
};

import { orderBurgerApi, getOrderByNumberApi } from '../../../utils/burger-api';

describe('Тест слайса orderSlice', () => {
  let state: TOrderState;

  beforeEach(() => {
    state = { ...initialState };
  });

  describe('Начальное состояние', () => {
    it('должно иметь корректное начальное состояние', () => {
      const init = orderReducer(undefined, { type: '' });
      expect(init).toEqual(initialState);
    });
  });

  describe('Reducer: clearOrder', () => {
    it('очищает состояние заказа', () => {
      const action = { type: 'order/clearOrder' };
      const newState = orderReducer(state, action);

      expect(newState.order).toBeNull();
      expect(newState.orderNumber).toBeNull();
      expect(newState.error).toBeNull();
    });
  });

  describe('createOrder.pending', () => {
    it('устанавливает orderRequest = true и сбрасывает error', () => {
      const action = { type: createOrder.pending.type };
      const newState = orderReducer(state, action);

      expect(newState.orderRequest).toBe(true);
      expect(newState.error).toBeNull();
    });
  });

  describe('createOrder.fulfilled', () => {
    it('обновляет состояние с данными успешного заказа', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: mockCreateOrderResponse.order
      };
      const newState = orderReducer(state, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.order).toEqual(mockCreateOrderResponse.order);
      expect(newState.orderNumber).toBe(mockCreateOrderResponse.order.number);
    });
  });

  describe('createOrder.rejected', () => {
    it('устанавливает error при ошибке создания заказа', () => {
      const errorMessage = 'Не удалось оформить заказ';
      const action = {
        type: createOrder.rejected.type,
        payload: errorMessage
      };
      const newState = orderReducer(state, action);

      expect(newState.orderRequest).toBe(false);
      expect(newState.error).toBe(errorMessage);
    });

    it('использует дефолтное сообщение, если payload отсутствует', () => {
      const action = {
        type: createOrder.rejected.type,
        payload: undefined
      };
      const newState = orderReducer(state, action);

      expect(newState.error).toBe('Не удалось оформить заказ');
    });
  });

  describe('getOrderByNumber.pending', () => {
    it('сбрасывает error', () => {
      const action = { type: getOrderByNumber.pending.type };
      const newState = orderReducer(state, action);

      expect(newState.error).toBeNull();
    });
  });

  describe('getOrderByNumber.fulfilled', () => {
    it('обновляет order данными из ответа', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockGetOrderByNumberResponse.orders[0]
      };
      const newState = orderReducer(state, action);

      expect(newState.order).toEqual(mockGetOrderByNumberResponse.orders[0]);
    });
  });

  describe('getOrderByNumber.rejected', () => {
    it('устанавливает error при ошибке загрузки заказа', () => {
      const errorMessage = 'Ошибка загрузки';
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: errorMessage
      };
      const newState = orderReducer(state, action);

      expect(newState.error).toBe(errorMessage);
    });

    it('использует дефолтное сообщение, если payload отсутствует', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: undefined
      };
      const newState = orderReducer(state, action);

      expect(newState.error).toBe('Ошибка загрузки');
    });
  });

  describe('Тест асинхронных действий', () => {
    let dispatch: jest.Mock;
    let getState: jest.Mock;

    beforeEach(() => {
      dispatch = jest.fn();
      getState = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
    describe('Асинхронное действие createOrder', () => {
      it('успешно создаёт заказ', async () => {
        (orderBurgerApi as jest.Mock).mockResolvedValue(
          mockCreateOrderResponse
        );

        getState.mockReturnValue({
          burgerConstructor: {
            bun: { _id: 'bun1' },
            ingredients: [{ _id: 'main1' }]
          }
        });

        const result = await createOrder()(dispatch, getState, undefined);
        expect(result.type).toBe(createOrder.fulfilled.type);
        expect(result.payload).toEqual(mockCreateOrderResponse.order);
      });

      it('возвращает ошибку, если булка не выбрана', async () => {
        getState.mockReturnValue({
          burgerConstructor: { bun: null, ingredients: [] }
        });

        const result = await createOrder()(dispatch, getState, undefined);
        expect(result.type).toBe(createOrder.rejected.type);
        expect(result.payload).toBe('Булка не выбрана');
      });

      it('обрабатывает ошибку API при создании заказа', async () => {
        (orderBurgerApi as jest.Mock).mockRejectedValue(
          new Error('Ошибка оформления заказа')
        );

        getState.mockReturnValue({
          burgerConstructor: {
            bun: { _id: 'bun1' },
            ingredients: [{ _id: 'main1' }]
          }
        });

        const result = await createOrder()(dispatch, getState, undefined);
        expect(result.type).toBe(createOrder.rejected.type);
        expect(result.payload).toBe('Ошибка оформления заказа');
      });
    });

    describe('Асинхронное действие getOrderByNumber', () => {
      it('успешно получает заказ (success: true)', async () => {
        const orderNumber = 2;

        (getOrderByNumberApi as jest.Mock).mockResolvedValue(
          mockGetOrderByNumberResponse
        );

        const result = await getOrderByNumber(orderNumber)(
          dispatch,
          getState,
          undefined
        );

        expect(result.type).toBe(getOrderByNumber.fulfilled.type);
        expect(result.payload).toEqual(mockGetOrderByNumberResponse.orders[0]);
        expect(getOrderByNumberApi).toHaveBeenCalledWith(orderNumber);
      });

      it('возвращает rejectWithValue при success: false', async () => {
        const orderNumber = 2;
        const mockResponse = {
          success: false
        };

        (getOrderByNumberApi as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getOrderByNumber(orderNumber)(
          dispatch,
          getState,
          undefined
        );

        expect(result.type).toBe(getOrderByNumber.rejected.type);
        expect(result.payload).toBe('Ошибка загрузки');
        expect(getOrderByNumberApi).toHaveBeenCalledWith(orderNumber);
      });

      it('обрабатывает ошибку API (catch-блок)', async () => {
        const orderNumber = 2;
        const errorMessage = 'Network Error';

        (getOrderByNumberApi as jest.Mock).mockRejectedValue(
          new Error(errorMessage)
        );

        const result = await getOrderByNumber(orderNumber)(
          dispatch,
          getState,
          undefined
        );

        expect(result.type).toBe(getOrderByNumber.rejected.type);
        expect(result.payload).toBe(errorMessage);
        expect(getOrderByNumberApi).toHaveBeenCalledWith(orderNumber);
      });

      it('корректно передаёт orderNumber в API', async () => {
        const orderNumber = 2;

        (getOrderByNumberApi as jest.Mock).mockResolvedValue(
          mockGetOrderByNumberResponse
        );

        await getOrderByNumber(orderNumber)(dispatch, getState, undefined);

        expect(getOrderByNumberApi).toHaveBeenCalledWith(orderNumber);
      });
    });
  });
});
