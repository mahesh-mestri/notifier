
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ----------------------------------
   Types
----------------------------------- */

export type NotificationSettings = {
  remindersEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  dailySummaryEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  snoozeMinutes: number;
};

/* ----------------------------------
   Storage Keys
----------------------------------- */

const NOTIFICATION_SETTINGS_KEY = '@notifier/notification-settings';

/* ----------------------------------
   Default Settings
----------------------------------- */

export const defaultNotificationSettings: NotificationSettings = {
  remindersEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  dailySummaryEnabled: false,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  snoozeMinutes: 10,
};

/* ----------------------------------
   Get Notification Settings
----------------------------------- */

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const storedSettings = await AsyncStorage.getItem(
      NOTIFICATION_SETTINGS_KEY,
    );

    if (!storedSettings) {
      return defaultNotificationSettings;
    }

    const parsedSettings = JSON.parse(storedSettings);

    return {
      ...defaultNotificationSettings,
      ...parsedSettings,
    };
  } catch (error) {
    console.warn('Failed to load notification settings:', error);
    return defaultNotificationSettings;
  }
}

/* ----------------------------------
   Save Notification Settings
----------------------------------- */

export async function saveNotificationSettings(
  settings: NotificationSettings,
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      NOTIFICATION_SETTINGS_KEY,
      JSON.stringify(settings),
    );
  } catch (error) {
    console.error('Failed to save notification settings:', error);
    throw error;
  }
}

/* ----------------------------------
   Reset Notification Settings
----------------------------------- */

export async function resetNotificationSettings(): Promise<void> {
  try {
    await AsyncStorage.removeItem(NOTIFICATION_SETTINGS_KEY);
  } catch (error) {
    console.error('Failed to reset notification settings:', error);
    throw error;
  }
}
