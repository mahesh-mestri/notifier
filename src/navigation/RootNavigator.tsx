import { memo, useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppStack from './stacks/AppStack';
import AuthStack from './stacks/AuthStack';

import AppLoader from '../components/ui/AppLoader';

import { hiddenHeaderOptions } from '../utils/navigationHeaderOptions';
import { RootStackParamList } from './types/navigation.types';
import { isOnboardingCompleted } from '../services/storage/onboardingStorage';
import { authStorage } from '../services/storage/authStorage';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectIsAuthenticated,
  setAuthenticated,
} from '../store/feature/auth/authSlice';

type AuthInitialRoute = 'Onboarding' | 'Signin';

type StartupState = {
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [startup, setStartup] = useState<StartupState>({
    isLoading: true,
    hasCompletedOnboarding: false,
  });

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        const [hasCompletedOnboarding, accessToken] = await Promise.all([
          isOnboardingCompleted(),
          authStorage.getAccessToken(),
        ]);

        if (!isMounted) {
          return;
        }

        if (accessToken) {
          dispatch(setAuthenticated(accessToken));
        }

        setStartup({
          isLoading: false,
          hasCompletedOnboarding,
        });
      } catch (error) {
        console.error('App initialization failed:', error);

        if (isMounted) {
          setStartup({
            isLoading: false,
            hasCompletedOnboarding: false,
          });
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const initialAuthRoute: AuthInitialRoute = startup.hasCompletedOnboarding
    ? 'Signin'
    : 'Onboarding';

  const renderAuthStack = useCallback(
    () => <AuthStack initialRouteName={initialAuthRoute} />,
    [initialAuthRoute],
  );

  if (startup.isLoading) {
    return <AppLoader />;
  }

  return (
    <Stack.Navigator screenOptions={hiddenHeaderOptions}>
      {isAuthenticated ? (
        <Stack.Screen
          name="AppStack"
          component={AppStack}
        />
      ) : (
        <Stack.Screen name="AuthStack">
          {renderAuthStack}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

export default memo(RootNavigator);