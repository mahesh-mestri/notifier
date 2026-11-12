
import type { NativeStackNavigationOptions } from
  '@react-navigation/native-stack';

export const commonScreenOptions: NativeStackNavigationOptions = {
  headerShown: true,
  animation: 'slide_from_right',
  gestureEnabled: true,
  contentStyle: {
    backgroundColor: '#F2F2F7',
  },
};

export const hiddenHeaderOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const authScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
};

export const modalScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  presentation: 'modal',
  animation: 'slide_from_bottom',
};
