import { View, Text } from 'react-native'
import React, { Children } from 'react'
import { Provider } from 'react-redux'
import { store } from '../store/store'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}