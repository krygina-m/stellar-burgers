import { RootState } from '../store';

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.user.user);
export const selectUserError = (state: RootState) => state.user.error;
export const selectIsUserLoading = (state: RootState) => state.user.isLoading;
