
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from '../tabs/BottomTabNavigator';
import { Settings } from 'react-native';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import { commonScreenOptions, hiddenHeaderOptions } from '../../utils/navigationHeaderOptions';
import { AppStackParamList } from '../types/navigation.types';
import CreateReminder from '../../screens/reminders/CreateReminder';
import ReminderDetails from '../../screens/reminders/ReminderDetails';
import { useTheme } from '@react-navigation/native';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen name="Settings" component={SettingsScreen}
        options={commonScreenOptions}
      />
      <Stack.Screen name="CreateReminder" component={CreateReminder}
        options={{
          ...commonScreenOptions({ theme }),
          title: 'Create Reminder',
        }}
      />
      <Stack.Screen name="ReminderDetails" component={ReminderDetails}
        options={{ ...commonScreenOptions({ theme }),
         title: 'Reminder Details' }}
      />
    </Stack.Navigator>
  )
}