import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export async function getStringItem(key: StorageKey | string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    if (__DEV__) {
      console.warn(`[AsyncStorage] Failed to get string for "${key}":`, error);
    }
    return null;
  }
}

export async function setStringItem(
  key: StorageKey | string,
  value: string,
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[AsyncStorage] Failed to set string for "${key}":`, error);
    }
    return false;
  }
}

export async function removeStorageItem(key: StorageKey | string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[AsyncStorage] Failed to remove "${key}":`, error);
    }
    return false;
  }
}

export async function getJsonItem<T>(key: StorageKey | string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[AsyncStorage] Failed to parse JSON for "${key}":`, error);
    }
    return null;
  }
}

export async function setJsonItem<T>(
  key: StorageKey | string,
  value: T,
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[AsyncStorage] Failed to set JSON for "${key}":`, error);
    }
    return false;
  }
}

// Onboarding helpers
export async function isOnboardingCompleted(): Promise<boolean> {
  const value = await getStringItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  return value === 'true';
}

export async function setOnboardingCompleted(completed = true): Promise<boolean> {
  return setStringItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed ? 'true' : 'false');
}

export async function resetOnboardingStatus(): Promise<boolean> {
  return removeStorageItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
}