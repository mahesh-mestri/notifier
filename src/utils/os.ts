
import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';

export const isNative = isIOS || isAndroid;

export const platform = Platform.OS;

export const isTV = Platform.isTV;

export const selectPlatform = <T,>(options: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T => {
  return Platform.select(options) ?? options.default;
};
