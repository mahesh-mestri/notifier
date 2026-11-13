
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from '../tabs/BottomTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
      {/* <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} /> */}
    </Stack.Navigator>
  )
}