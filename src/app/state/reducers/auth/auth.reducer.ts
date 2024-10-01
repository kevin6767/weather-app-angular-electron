import { createReducer, on } from '@ngrx/store';
import { login, logout } from '../../actions/auth/auth.actions';

export interface AuthState {
  isLoggedIn: boolean;
  user: any;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

export const authReducer = createReducer(
  initialState,
  on(login, (state) => ({
    ...state,
    isLoggedIn: true,
  })),
  on(logout, (state) => ({
    ...state,
    isLoggedIn: false,
  })),
);
