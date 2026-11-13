
import React, { PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { lightTheme, darkTheme } from '../utils/theme';

export default function NavigationProvider({
  children,
}: PropsWithChildren) {
  const colorScheme = useColorScheme();

  const activeTheme =
    colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <NavigationContainer theme={activeTheme}>
      {children}
    </NavigationContainer>
  );
}
