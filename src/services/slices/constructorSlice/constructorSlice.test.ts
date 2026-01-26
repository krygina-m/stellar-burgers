import {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  initialState,
  constructorReducer,
  TConstructorState
} from './constructorSlice';

import type { TConstructorIngredient } from '@utils-types';

// Mock данных
const mockBun: TConstructorIngredient = {
  _id: 'bun-1',
  id: 'bun-1',
  type: 'bun',
  name: 'Bun',
  proteins: 20,
  fat: 24,
  carbohydrates: 53,
  calories: 310,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain1: TConstructorIngredient = {
  _id: 'main-1',
  id: 'main-1',
  type: 'main',
  name: 'Main 1',
  proteins: 80,
  fat: 4,
  carbohydrates: 3,
  calories: 420,
  price: 2500,
  image: 'https://code.s3.yandex.net/react/code/main-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/main-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/main-01-large.png'
};

const mockMain2: TConstructorIngredient = {
  _id: 'main-2',
  id: 'main-2',
  type: 'main',
  name: 'Main 2',
  proteins: 10,
  fat: 75,
  carbohydrates: 10,
  calories: 420,
  price: 2000,
  image: 'https://code.s3.yandex.net/react/code/main-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/main-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/main-02-large.png'
};

describe('Тест слайса constructorSlice', () => {
  let state: TConstructorState;

  beforeEach(() => {
    state = { ...initialState };
  });

  it('начальное состояние корректно', () => {
    const init = constructorReducer(undefined, { type: '' });
    expect(init).toEqual(initialState);
  });

  describe('Действия конструктора', () => {
    it('Добавление верхней и нижней булочек в конструктор', () => {
      const result = constructorReducer(state, addIngredient(mockBun));

      expect(result.bun).toEqual(
        expect.objectContaining({
          _id: mockBun._id,
          type: 'bun',
          name: 'Bun'
        })
      );
      expect(result.ingredients).toHaveLength(0);
    });

    it('Замена существующей булочки на новую', () => {
      let result = constructorReducer(state, addIngredient(mockBun));
      const newBun = { ...mockBun, _id: 'new-bun', name: 'New Bun' };

      result = constructorReducer(result, addIngredient(newBun));

      expect(result.bun?._id).toBe('new-bun');
      expect(result.bun?.name).toBe('New Bun');
      expect(result.ingredients).toHaveLength(0);
    });

    it('Добавление основного ингредиента', () => {
      const result = constructorReducer(state, addIngredient(mockMain1));

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0]).toEqual(mockMain1);
    });

    it('Удаление основного ингредиента', () => {
      const preloaded = {
        bun: null,
        ingredients: [mockMain1, mockMain2]
      };

      const result = constructorReducer(preloaded, removeIngredient('main-1'));

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].id).toBe('main-2');
    });

    it('Перемещение ингредиента вверх', () => {
      const preloaded = {
        bun: null,
        ingredients: [mockMain1, mockMain2]
      };

      const result = constructorReducer(preloaded, moveIngredientUp(1));

      expect(result.ingredients.map((i) => i.id)).toEqual(['main-2', 'main-1']);
    });

    it('Перемещение ингредиента вниз', () => {
      const preloaded = {
        bun: null,
        ingredients: [mockMain1, mockMain2]
      };

      const result = constructorReducer(preloaded, moveIngredientDown(0));

      expect(result.ingredients.map((i) => i.id)).toEqual(['main-2', 'main-1']);
    });

    it('Очистка конструктора', () => {
      const state = {
        ...initialState,
        bun: mockBun,
        ingredients: [mockMain1, mockMain2]
      };

      const result = constructorReducer(state, clearConstructor());

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });
  });
});
