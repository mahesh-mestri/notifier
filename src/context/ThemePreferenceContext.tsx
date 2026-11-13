
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemePreferenceContextType = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isThemeLoaded: boolean;
};

const STORAGE_KEY = '@notifier/theme-mode';

const ThemePreferenceContext =
  createContext<ThemePreferenceContextType | undefined>(undefined);

export function ThemePreferenceProvider({
  children,
}: PropsWithChildren) {
  const [themeMode, setThemeModeState] =
    useState<ThemeMode>('system');

  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);

        if (
          mounted &&
          (savedTheme === 'system' ||
            savedTheme === 'light' ||
            savedTheme === 'dark')
        ) {
          setThemeModeState(savedTheme);
        }
      } catch (error) {
        console.warn('Failed to load theme:', error);
      } finally {
        if (mounted) {
          setIsThemeLoaded(true);
        }
      }
    };

    loadTheme();

    return () => {
      mounted = false;
    };
  }, []);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    setThemeModeState(mode);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save theme:', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      isThemeLoaded,
    }),
    [themeMode, setThemeMode, isThemeLoaded],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const context = useContext(ThemePreferenceContext);

  if (!context) {
    throw new Error(
      'useThemePreference must be used inside ThemePreferenceProvider',
    );
  }

  return context;
}
