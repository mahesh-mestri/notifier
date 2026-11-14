
import { memo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Signup from '../../screens/auth/Signup';
import Signin from '../../screens/auth/Signin';
import OnBoarding from '../../screens/OnBoarding';

import {
  hiddenHeaderOptions,
  commonScreenOptions,
} from '../../utils/navigationHeaderOptions';

import { AuthStackParamList } from '../types/navigation.types';

type AuthStackProps = {
  initialRouteName: 'Onboarding' | 'Signin';
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

function AuthStack({ initialRouteName }: AuthStackProps) {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="Onboarding"
        component={OnBoarding}
        options={hiddenHeaderOptions}
      />

      <Stack.Screen
        name="Signin"
        component={Signin}
        options={hiddenHeaderOptions}
      />

      <Stack.Screen
        name="Signup"
        component={Signup}
        options={commonScreenOptions}
      />
    </Stack.Navigator>
  );
}

export default memo(AuthStack);
