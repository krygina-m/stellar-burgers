import { FC } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { logout } from '../../services/slices/userSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /*const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login', { replace: true });
    } catch (_) {
      // Ошибку можем показать через глобальный тост, если добавим
    }
  };*/

  const handleLogout = () => {
    <Navigate replace to={'/login'} />;
    dispatch(logout()).unwrap();
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
