import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../state/reducers/auth/auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggedIn,
);
