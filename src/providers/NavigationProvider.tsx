
import React, { PropsWithChildren } from 'react';
import { Text, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { lightTheme, darkTheme } from '../utils/theme';
import {
  ThemePreferenceProvider,
  useThemePreference,
} from '../context/ThemePreferenceContext';

function NavigationContent({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const { themeMode, isThemeLoaded } = useThemePreference();

  const isDark =
    themeMode === 'system'
      ? colorScheme === 'dark'
      : themeMode === 'dark';

  const activeTheme = isDark ? darkTheme : lightTheme;

  if (!isThemeLoaded) {
    return <Text>Loading navigation...</Text>;
  }

  return (
    <NavigationContainer
      theme={activeTheme}
      fallback={<Text>Loading navigation...</Text>}
    >
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
