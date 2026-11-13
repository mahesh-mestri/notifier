
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';

// Authentication
export type AuthStackParamList = {
  Onboarding: undefined;
  Signin: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  VerifyOtp: {
    email: string;
  };
};

// Bottom Tabs
export type BottomTabParamList = {
  Home: undefined;
  Reminders: undefined;
  Categories: undefined;
  Profile: undefined;
};

// App Stack
export type AppStackParamList = {
  BottomTabNavigator: NavigatorScreenParams<BottomTabParamList>;

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

// Modal Stack
export type ReminderModalParamList = {
  ReminderPopup: {
    reminderId: string;
  };
  SnoozeReminder: {
    reminderId: string;
  };
};

// Root Stack
export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  AppStack: NavigatorScreenParams<AppStackParamList>;
};

// Screen Props
export type SigninScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Signin'
>;

export type HomeScreenProps = NativeBottomTabScreenProps<
  BottomTabParamList,
  'Home'
>;

export type RemindersScreenProps = NativeBottomTabScreenProps<
  BottomTabParamList,
  'Reminders'
>;

export type CategoriesScreenProps = NativeBottomTabScreenProps<
  BottomTabParamList,
  'Categories'
>;

export type ProfileScreenProps = NativeBottomTabScreenProps<
  BottomTabParamList,
  'Profile'
>;

export type AppStackScreenProps<
  T extends keyof AppStackParamList
> = NativeStackScreenProps<AppStackParamList, T>;
