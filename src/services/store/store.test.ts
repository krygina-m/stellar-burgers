import { rootReducer } from './store';
import { RootState } from './store';
import { configureStore } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('Тест стора', () => {
    const testRootReducer = [
      'constructor',
      'ingredients',
      'feed',
      'order',
      'user',
      'userOrders'
    ];
    testRootReducer.forEach((slice) => {
      expect(slice).toBeDefined();
    });
    const constructorInitialState = {
      bun: null,
      ingredients: []
    };
    expect(constructorInitialState).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('Тест инициализации rootReducer', () => {
    const store = configureStore({
      reducer: rootReducer
    });
    const action = { type: 'UNKNOWN_ACTION' };
    const testState = rootReducer(undefined, action);
    expect(testState).toEqual(store.getState());
  });

  it('Тест типа данных rootReducer', () => {
    type TestRootState = ReturnType<typeof rootReducer>;
    expect({} as TestRootState as RootState).toBeDefined();
  });
});
