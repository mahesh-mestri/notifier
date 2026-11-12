
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from '../../screens/auth/Signup';
import Signin from '../../screens/auth/Signin';
import Onboarding from '../../components/onboarding/StayOrganized';


const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  )
}