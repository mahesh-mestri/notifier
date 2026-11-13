import React, { PropsWithChildren } from 'react';
import { Text, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { lightTheme, darkTheme } from '../utils/theme';

import {
  ThemePreferenceProvider,
  useThemePreference,
} from '../context/ThemePreferenceContext';

function NavigationContent({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const { themeMode, isThemeLoaded } = useThemePreference();

  if (!isThemeLoaded) {
    return <Text>Loading navigation...</Text>;
  }

  const isDark =
    themeMode === 'system'
      ? systemScheme === 'dark'
      : themeMode === 'dark';

  const activeTheme = isDark ? darkTheme : lightTheme;

  return (
    <NavigationContainer theme={activeTheme}>
      {children}
    </NavigationContainer>
  );
}

export default function NavigationProvider({
  children,
}: PropsWithChildren) {
  return (
    <ThemePreferenceProvider>
      <NavigationContent>{children}</NavigationContent>
    </ThemePreferenceProvider>
  );
}