import React, { FC, useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectIsAuthChecked
} from '../../services/slices/userSlice';
import { getUser } from '../../services/slices/userSlice';

import '../../index.css';
import styles from './app.module.css';

import { ProtectedRouteElement } from '../protected-route/protected-route'; // Импорт из нового файла

const App: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Глобальная инициализация ингредиентов, чтобы модалки сработали на любой странице
  useEffect(() => {
    // Ленивая подгрузка: импортируем здесь, чтобы избежать циклических зависимостей
    // и не тянуть thunk в бандл дважды
    import('../../services/slices/ingredientsSlice').then(
      ({ fetchIngredients }) => {
        dispatch(fetchIngredients());
      }
    );
  }, [dispatch]);

  const state = location.state as
    | { backgroundLocation?: Location; background?: Location }
    | undefined;
  const backgroundLocation = state?.backgroundLocation || state?.background;

  const handleCloseModal = () => {
    // Если есть backgroundLocation, используем его для перехода
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname);
    } else {
      // Иначе определяем базовый путь из текущего URL
      const currentPath = location.pathname;
      if (currentPath.startsWith('/feed/')) {
        navigate('/feed');
      } else if (currentPath.startsWith('/profile/orders/')) {
        navigate('/profile/orders');
      } else if (currentPath.startsWith('/ingredients/')) {
        navigate('/');
      } else {
        navigate(-1);
      }
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRouteElement element={<OrderInfo />} />}
        />

        <Route
          path='/login'
          element={<ProtectedRouteElement onlyUnAuth element={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRouteElement onlyUnAuth element={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRouteElement onlyUnAuth element={<ForgotPassword />} />
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRouteElement onlyUnAuth element={<ResetPassword />} />
          }
        />

        <Route
          path='/profile'
          element={<ProtectedRouteElement element={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRouteElement element={<ProfileOrders />} />}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRouteElement
                element={
                  <Modal title='' onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
