import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser, selectUserError } from '../../services/selectors/user';
import { updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const updatedUserData: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (formValue.name !== user?.name) {
      updatedUserData.name = formValue.name;
    }
    if (formValue.email !== user?.email) {
      updatedUserData.email = formValue.email;
    }
    if (formValue.password) {
      updatedUserData.password = formValue.password;
    }

    if (Object.keys(updatedUserData).length === 0) {
      return;
    }

    try {
      await dispatch(updateUser(updatedUserData)).unwrap();
      setFormValue((prevState) => ({
        ...prevState,
        password: ''
      }));
    } catch (_) {
      // Ошибку отдаёт selectUserError -> ProfileUI
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError || ''}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
