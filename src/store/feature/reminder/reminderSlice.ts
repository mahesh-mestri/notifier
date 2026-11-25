import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../..';

import type {
    CreateReminderRequest,
    Reminder, // adjust to match your created reminder response type
} from '../../../types/reminder.types';
import { createReminderApi } from '../../../services/reminder/reminderService';

interface ReminderState {
    items: Reminder[];
    lastCreated: Reminder | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ReminderState = {
    items: [],
    lastCreated: null,
    isLoading: false,
    error: null,
};

export const createReminder = createAsyncThunk<any, CreateReminderRequest, { rejectValue: string }>(
    'reminder/createReminder',
    async (payload, { rejectWithValue }) => {
        try {
            console.log('Outgoing /api/v1/reminder body:', JSON.stringify(payload));
            const response = await createReminderApi(payload);
            return response.data;
        } catch (error: any) {
            console.error('error in reminderSlice: ', error);
            return rejectWithValue(
                error?.response?.data?.message ?? 'Failed to create reminder',
            );
        }
    },
);

export const reminderSlice = createSlice({
    name: 'reminder',
    initialState,

    reducers: {
        clearReminderError: state => {
            state.error = null;
        },

        resetReminderState: state => {
            state.items = [];
            state.lastCreated = null;
            state.isLoading = false;
            state.error = null;
        },
    },

    extraReducers: builder => {
        builder
            .addCase(createReminder.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createReminder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.lastCreated = action.payload;
                state.items.unshift(action.payload);
            })
            .addCase(createReminder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Failed to create reminder';
            });
    },
});

// Actions
export const { clearReminderError, resetReminderState } = reminderSlice.actions;

// Selectors
export const selectReminders = (state: RootState) => state.reminder.items;

export const selectReminderLoading = (state: RootState) =>
    state.reminder.isLoading;

export const selectReminderError = (state: RootState) =>
    state.reminder.error;

export default reminderSlice.reducer;