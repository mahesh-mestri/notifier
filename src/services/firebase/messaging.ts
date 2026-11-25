import { getApp } from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getInitialNotification,
  getMessaging,
  getToken,
  hasPermission,
  isDeviceRegisteredForRemoteMessages,
  onNotificationOpenedApp,
  registerDeviceForRemoteMessages,
  requestPermission,
  type RemoteMessage,
} from '@react-native-firebase/messaging';

type FirebaseAuthorizationStatus =
  (typeof AuthorizationStatus)[keyof typeof AuthorizationStatus];

const getMessagingInstance = () => getMessaging(getApp());

const isAuthorized = (status: FirebaseAuthorizationStatus): boolean =>
  status === AuthorizationStatus.AUTHORIZED ||
  status === AuthorizationStatus.PROVISIONAL;

export async function checkNotificationPermission(): Promise<boolean> {
  try {
    const status = await hasPermission(getMessagingInstance());
    return isAuthorized(status);
  } catch (error) {
    if (__DEV__) {
      console.warn('[Messaging] Error checking notification permission:', error);
    }
    return false;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const status = await requestPermission(getMessagingInstance());
    return isAuthorized(status);
  } catch (error) {
    if (__DEV__) {
      console.warn('[Messaging] Error requesting notification permission:', error);
    }
    return false;
  }
}

export async function getFcmToken(
  requestIfMissing = false,
): Promise<string | null> {
  try {
    let allowed = await checkNotificationPermission();

    if (!allowed && requestIfMissing) {
      allowed = await requestNotificationPermission();
    }

    if (!allowed) {
      return null;
    }

    const messaging = getMessagingInstance();

    // if (Platform.OS === 'ios') {
    //   try {
    //     if (!isDeviceRegisteredForRemoteMessages(messaging)) {
    //       await registerDeviceForRemoteMessages(messaging);
    //     }
    //   } catch (iosRegisterError) {
    //     // Expected during development on a free Apple Personal Team without APNs capability.
    //     if (__DEV__) {
    //       console.info(
    //         '[Messaging] iOS APNs registration skipped/unavailable in current signing setup:',
    //         iosRegisterError,
    //       );
    //     }
    //     return null;
    //   }
    // }

    const token = await getToken(messaging);
    return token || null;
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (__DEV__) {
      console.warn(
        '[Messaging] Unable to retrieve FCM token:',
        err?.code ?? 'no-code',
        err?.message ?? error,
      );
    }
    return null;
  }
}

export function registerNotificationOpenListeners(
  onOpen: (remoteMessage: RemoteMessage) => void,
): () => void {
  const messaging = getMessagingInstance();

  getInitialNotification(messaging).then((remoteMessage) => {
    if (remoteMessage) {
      onOpen(remoteMessage);
    }
  });

  return onNotificationOpenedApp(messaging, (remoteMessage) => {
    if (remoteMessage) {
      onOpen(remoteMessage);
    }
  });
}