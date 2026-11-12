
import {
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';

const appleColors = {
  light: {
    ...MD3LightTheme.colors,

    primary: '#007AFF',
    onPrimary: '#FFFFFF',
    primaryContainer: '#DCEBFF',
    onPrimaryContainer: '#001D36',

    secondary: '#8E8E93',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E5E5EA',
    onSecondaryContainer: '#242428',

    tertiary: '#34C759',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#D9F8E0',
    onTertiaryContainer: '#00210A',

    error: '#FF3B30',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',

    background: '#F2F2F7',
    onBackground: '#1C1C1E',

    surface: '#FFFFFF',
    onSurface: '#1C1C1E',

    surfaceVariant: '#E5E5EA',
    onSurfaceVariant: '#636366',

    outline: '#C7C7CC',
    outlineVariant: '#D1D1D6',

    shadow: '#000000',
    scrim: '#000000',

    inverseSurface: '#3A3A3C',
    inverseOnSurface: '#F2F2F7',
    inversePrimary: '#409CFF',

    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FAFAFC',
      level3: '#F7F7FA',
      level4: '#F5F5F8',
      level5: '#F2F2F7',
    },

    surfaceDisabled: 'rgba(28, 28, 30, 0.12)',
    onSurfaceDisabled: 'rgba(28, 28, 30, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.4)',
  },

  dark: {
    ...MD3DarkTheme.colors,

    // Same Apple brand blue
    primary: '#007AFF',
    onPrimary: '#FFFFFF',
    primaryContainer: '#003A70',
    onPrimaryContainer: '#DCEBFF',

    secondary: '#98989D',
    onSecondary: '#1C1C1E',
    secondaryContainer: '#3A3A3C',
    onSecondaryContainer: '#E5E5EA',

    tertiary: '#30D158',
    onTertiary: '#003910',
    tertiaryContainer: '#00531F',
    onTertiaryContainer: '#D9F8E0',

    error: '#FF453A',
    onError: '#FFFFFF',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',

    background: '#000000',
    onBackground: '#FFFFFF',

    surface: '#1C1C1E',
    onSurface: '#FFFFFF',

    surfaceVariant: '#2C2C2E',
    onSurfaceVariant: '#C7C7CC',

    outline: '#636366',
    outlineVariant: '#48484A',

    shadow: '#000000',
    scrim: '#000000',

    inverseSurface: '#F2F2F7',
    inverseOnSurface: '#1C1C1E',
    inversePrimary: '#007AFF',

    elevation: {
      level0: 'transparent',
      level1: '#242426',
      level2: '#28282A',
      level3: '#2C2C2E',
      level4: '#303032',
      level5: '#343436',
    },

    surfaceDisabled: 'rgba(255, 255, 255, 0.12)',
    onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
  },
};

const theme = {
  light: {
    ...MD3LightTheme,
    roundness: 12,
    colors: appleColors.light,
    myOwnProperty: true,
  },

  dark: {
    ...MD3DarkTheme,
    roundness: 12,
    colors: appleColors.dark,
    myOwnProperty: true,
  },
};

export default theme;
