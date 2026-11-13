
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Authentication & onboarding
export type AuthStackParamList = {
  Onboarding: undefined;
  Signin: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  VerifyOtp: {
    email: string;
  };
};

// Main application tabs
export type BottomTabParamList = {
  Home: undefined;
  Reminders: undefined;
  Categories: undefined;
  Profile: undefined;
};

// Authenticated application screens
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;

  CreateReminder: undefined;
  EditReminder: {
    reminderId: string;
  };
  ReminderDetails: {
    reminderId: string;
  };

  Settings: undefined;
  NotificationSettings: undefined;
  CompletedReminders: undefined;
};

// Optional modal navigation
export type ReminderModalParamList = {
  ReminderPopup: {
    reminderId: string;
  };
  SnoozeReminder: {
    reminderId: string;
  };
};

// Root navigation
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppStack: NavigatorScreenParams<AppStackParamList>;
};

// Screen props
export type SigninScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Signin'
>;

export type HomeScreenProps = NativeStackScreenProps<
  BottomTabParamList,
  'Home'
>;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;
