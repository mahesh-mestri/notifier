
import { memo, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppStack from './stacks/AppStack';
import AuthStack from './stacks/AuthStack';

import AppLoader from '../components/ui/AppLoader';

import { hiddenHeaderOptions } from '../utils/navigationHeaderOptions';
import { RootStackParamList } from './types/navigation.types';
import { onboardingStorage } from '../services/storage/onboardingStorage';
import { authStorage } from '../services/storage/authStorage';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectIsAuthenticated,
  setAuthenticated,
} from '../store/feature/auth/authSlice';

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
        const [hasCompletedOnboarding, accessToken] =
          await Promise.all([
            onboardingStorage.isCompleted(),
            authStorage.getAccessToken(),
          ]);

        if (isMounted) {
          if (accessToken) {
            dispatch(setAuthenticated(accessToken));
          }

          setStartup({
            isLoading: false,
            hasCompletedOnboarding,
          });
        }
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

  if (startup.isLoading) {
    return <AppLoader />;
  }

  const initialAuthRoute = startup.hasCompletedOnboarding
    ? 'Signin'
    : 'Onboarding';

  return (
    <Stack.Navigator
      screenOptions={hiddenHeaderOptions}
      initialRouteName={
        isAuthenticated ? 'AppStack' : 'AuthStack'
      }
    >
      {isAuthenticated ? (
        <Stack.Screen
          name="AppStack"
          component={AppStack}
        />
      ) : (
        <Stack.Screen name="AuthStack">
          {() => (
            <AuthStack initialRouteName={initialAuthRoute} />
          )}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}

export default memo(RootNavigator);
