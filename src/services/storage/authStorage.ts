
import * as Keychain from 'react-native-keychain';

const AUTH_SERVICE = 'com.notifier.auth';

export const authStorage = {
  async saveAccessToken(token: string): Promise<void> {
    await Keychain.setGenericPassword(
      'auth',
      token,
      { service: AUTH_SERVICE },
    );
  },

  async getAccessToken(): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword({
      service: AUTH_SERVICE,
    });

    return credentials ? credentials.password : null;
  },

  async clear(): Promise<void> {
    await Keychain.resetGenericPassword({
      service: AUTH_SERVICE,
    });
  },
};
