
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../..';

import type {
  AuthState,
  AuthResponse,
  LoginPayload,
  SignupPayload,
  AuthData,
} from '../../../types/auth.types';
import { loginUser, signupUser } from '../../../services/auth/authService';
import { authStorage } from '../../../services/storage/authStorage';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk<
  AuthData,
  LoginPayload,
  { rejectValue: string }
>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginUser(payload);
      const authData = response.data;

      await authStorage.saveAccessToken(authData.accessToken);

      return authData;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? 'Login failed',
      );
    }
  },
);

export const signup = createAsyncThunk<
  AuthData,
  SignupPayload,
  { rejectValue: string }
>(
  'auth/signup',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await signupUser(payload);
      const authData = response.data;

      await authStorage.saveAccessToken(authData.accessToken);

      return authData;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? 'Signup failed',
      );
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout: state => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    clearAuthError: state => {
      state.error = null;
    },

    setAuthenticated: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
  },

  extraReducers: builder => {
    builder
      // LOGIN
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
        };
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Login failed';
      })

      // SIGNUP
      .addCase(signup.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          id: action.payload.id,
          email: action.payload.email,
        };
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Signup failed';
      });
  },
});

// Actions
export const { logout, clearAuthError, setAuthenticated } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectAuthLoading = (state: RootState) =>
  state.auth.isLoading;

export const selectAuthError = (state: RootState) =>
  state.auth.error;

export default authSlice.reducer;
