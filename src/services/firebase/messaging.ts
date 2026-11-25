import {
  getMessaging,
  getToken,
} from '@react-native-firebase/messaging';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

const messagingInstance = getMessaging();

export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await checkNotifications();
    return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  } catch (error) {
    if (__DEV__) {
      console.warn('Error checking notification permission:', error);
    }
    return false;
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await requestNotifications(['alert', 'badge', 'sound']);
    return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  } catch (error) {
    if (__DEV__) {
      console.warn('Error requesting notification permission:', error);
    }
    return false;
  }
};

export const getFcmToken = async (): Promise<string | null> => {
  try {
    // Kept on getToken() while backend targets FCM device registration tokens (FID opt-in disabled)
    const token = await getToken(messagingInstance);

    if (__DEV__) {
      console.log('FCM Token:', token);
    }

    return token || null;
  } catch (error) {
    if (__DEV__) {
      console.warn('Error fetching FCM token:', error);
    }
    return null;
  }
};