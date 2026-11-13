
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from '../tabs/BottomTabNavigator';
import { Settings } from 'react-native';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import { commonScreenOptions, hiddenHeaderOptions } from '../../utils/navigationHeaderOptions';
import { AppStackParamList } from '../types/navigation.types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} 
        options={hiddenHeaderOptions}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} 
        options={commonScreenOptions}
      />
      <Stack.Screen name="CreateReminder" component={SettingsScreen} 
        options={commonScreenOptions}
      />
      <Stack.Screen name="ReminderDetails" component={SettingsScreen} 
        options={commonScreenOptions}
      />
    </Stack.Navigator>
  )
}