
import {
  DefaultTheme,
  DarkTheme,
  type Theme,
} from '@react-navigation/native';

export const lightTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#1C1C1E',
    border: '#C7C7CC',
    notification: '#FF3B30',
  },
};

export const darkTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: '#007AFF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#636366',
    notification: '#FF453A',
  },
};
