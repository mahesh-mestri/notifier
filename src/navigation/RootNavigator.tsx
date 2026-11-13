
import { memo } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppStack from './stacks/AppStack';
import AuthStack from './stacks/AuthStack';
import { hiddenHeaderOptions } from '../utils/navigationHeaderOptions';
import { RootStackParamList } from './types/navigation.types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    // as per the token we have we will decide which stack to show, for now we will show the AuthStack
  return (
    <Stack.Navigator initialRouteName="AppStack" screenOptions={hiddenHeaderOptions}>
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="AppStack" component={AppStack} />
    </Stack.Navigator>
  )
}

export default memo(RootNavigator);