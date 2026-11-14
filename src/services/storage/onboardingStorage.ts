
import * as Keychain from 'react-native-keychain';

const ONBOARDING_SERVICE = 'com.notifier.onboarding';

export const onboardingStorage = {
  async markCompleted(): Promise<void> {
    await Keychain.setGenericPassword(
      'onboarding',
      'completed',
      {
        service: ONBOARDING_SERVICE,
      },
    );
  },

  async isCompleted(): Promise<boolean> {
    const credentials = await Keychain.getGenericPassword({
      service: ONBOARDING_SERVICE,
    });

    return (
      credentials !== false &&
      credentials.password === 'completed'
    );
  },

  async reset(): Promise<void> {
    await Keychain.resetGenericPassword({
      service: ONBOARDING_SERVICE,
    });
  },
};
