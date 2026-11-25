import { configureStore } from '@reduxjs/toolkit'
import authReducer from './feature/auth/authSlice'
import reminderReducer from './feature/reminder/reminderSlice'
import fcmReducer from './feature/reminder/fcmSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reminder: reminderReducer,
    fcm: fcmReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store