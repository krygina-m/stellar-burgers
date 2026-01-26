import { FC, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store/store';
import { selectIsAuthenticated } from '../../services/slices/userSlice/userSlice';
import {
  createOrder,
  clearOrder
} from '../../services/slices/orderSlice/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice/constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients =
    useSelector((state) => state.burgerConstructor.ingredients) || [];

  const constructorItems = useSelector((state) => state.burgerConstructor);

  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.order);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleOrderClick = async () => {
    if (!bun || orderRequest) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    await dispatch(createOrder()).unwrap();
    dispatch(clearConstructor());
  };

  const handleCloseOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) =>
          sum + ingredient.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
