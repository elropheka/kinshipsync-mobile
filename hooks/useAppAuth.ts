import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  logoutUser,
  selectCurrentUser,
  selectAuthToken,
  selectAuthIsLoading,
  selectAuthError,
  selectIsAuthInitialized,
} from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../types/redux';

export const useAppAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const token = useSelector((state: RootState) => selectAuthToken(state));
  const isLoading = useSelector((state: RootState) => selectAuthIsLoading(state));
  const error = useSelector((state: RootState) => selectAuthError(state));
  const isInitialized = useSelector((state: RootState) => selectIsAuthInitialized(state));

  const logout = useCallback(() => {
    return dispatch(logoutUser()).unwrap();
  }, [dispatch]);

  return {
    user,
    token,
    isLoading,
    error,
    isInitialized,
    logout,
  };
};
