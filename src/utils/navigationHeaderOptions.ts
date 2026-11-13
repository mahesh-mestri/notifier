
import type { Theme } from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { isIOS } from './os';

type ScreenOptionsProps = {
  theme: Theme;
};

export const commonScreenOptions = ({
  theme,
}: ScreenOptionsProps): NativeStackNavigationOptions => ({
  headerShown: true,
  animation: 'slide_from_right',
  gestureEnabled: true,
  headerBackButtonDisplayMode: 'minimal',
  headerStyle: {
    backgroundColor: theme.colors.background,
  },
  headerTintColor: theme.colors.text,
  headerTitleStyle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
  headerBlurEffect: 'extraLight',
  headerTransparent: isIOS,
});

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
