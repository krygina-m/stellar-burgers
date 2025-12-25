import { FC, useEffect } from 'react';

import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectUserOrders,
  selectUserOrdersIsLoading,
  selectUserOrdersError
} from '../../services/selectors/userOrders';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectUserOrdersIsLoading);
  const error = useSelector(selectUserOrdersError);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className='mt-10 text text_type_main-default text_color_inactive'>
        {error}
      </p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
