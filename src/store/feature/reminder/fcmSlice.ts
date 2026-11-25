import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../..';

import type { FcmState } from '../../../types/fcm.types';
import {
  saveFcmTokenApi,
  removeFcmTokenApi,
} from '../../../services/firebase/fcmService';

const initialState: FcmState = {
  token: null,
  isSynced: false,
  isLoading: false,
  error: null,
};

export const syncFcmToken = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'fcm/syncFcmToken',
  async (token, { rejectWithValue }) => {
    try {
      await saveFcmTokenApi(token);
      return token;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? 'Failed to register device token',
      );
    }
  },
);

export const unregisterFcmToken = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>(
  'fcm/unregisterFcmToken',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().fcm.token;
    if (!token) return;

    try {
      await removeFcmTokenApi(token);
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ?? 'Failed to remove device token',
      );
    }
  },
);

export const fcmSlice = createSlice({
  name: 'fcm',
  initialState,

  reducers: {
    setFcmToken: (state, action: PayloadAction<string>) => {
      if (state.token !== action.payload) {
        state.token = action.payload;
        state.isSynced = false;
      }
    },

    clearFcmError: state => {
      state.error = null;
    },

    resetFcmState: state => {
      state.token = null;
      state.isSynced = false;
      state.isLoading = false;
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      // SYNC TOKEN
      .addCase(syncFcmToken.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncFcmToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
        state.isSynced = true;
      })
      .addCase(syncFcmToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isSynced = false;
        state.error = action.payload ?? 'Failed to register device token';
      })

      // UNREGISTER TOKEN
      .addCase(unregisterFcmToken.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unregisterFcmToken.fulfilled, state => {
        state.token = null;
        state.isSynced = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(unregisterFcmToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to remove device token';
      });
  },
});

// Actions
export const { setFcmToken, clearFcmError, resetFcmState } = fcmSlice.actions;

// Selectors
export const selectFcmToken = (state: RootState) => state.fcm.token;

export const selectIsFcmSynced = (state: RootState) => state.fcm.isSynced;

export const selectFcmLoading = (state: RootState) => state.fcm.isLoading;

export const selectFcmError = (state: RootState) => state.fcm.error;

export default fcmSlice.reducer;