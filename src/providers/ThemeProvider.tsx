
import React, { memo, PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import theme from '../utils/theme';

function ThemeProvider({ children }: PropsWithChildren) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <PaperProvider
      theme={isDarkMode ? theme.dark : theme.light}
    >
      {children}
    </PaperProvider>
  );
}

export default memo(ThemeProvider);
