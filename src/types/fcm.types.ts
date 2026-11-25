export type DevicePlatform = 'IOS' | 'ANDROID';

export interface RegisterFcmTokenPayload {
  token: string;
  platform: DevicePlatform;
}

export interface FcmState {
  token: string | null;
  isSynced: boolean;
  isLoading: boolean;
  error: string | null;
}