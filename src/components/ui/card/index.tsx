
import React, { PropsWithChildren } from 'react';
import {
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';

import AppCard from './AppCard';
import GlassCard from './GlassCard';

export { AppCard, GlassCard };

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function PlatformCard({ children, style }: Props) {
  if (Platform.OS === 'ios') {
    return (
      <GlassCard style={style}>
        {children}
      </GlassCard>
    );
  }

  return (
    <AppCard style={style}>
      {children}
    </AppCard>
  );
}
