import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store/store';
import {
  selectIsAuthenticated,
  selectIsAuthChecked
} from '../../services/slices/userSlice/userSlice';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  element: JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRouteElement: FC<TProtectedRouteProps> = ({
  element,
  onlyUnAuth
}) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return (
      <div className='mt-30' style={{ textAlign: 'center' }}>
        <Preloader />
      </div>
    );
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && isAuth) {
    return <Navigate to='/' replace />;
  }

  return element;
};
