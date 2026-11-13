
import React, { PropsWithChildren } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@react-navigation/native';

import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  effect?: 'clear' | 'regular' | 'none';
  interactive?: boolean;
  tintColor?: string;
}>;

export default function GlassCard({
  children,
  style,
  effect = 'regular',
  interactive = false,
  tintColor,
}: Props) {
  const { colors, dark } = useTheme();

  return (
    <LiquidGlassView
      effect={effect}
      interactive={interactive}
      tintColor={tintColor}
      colorScheme={dark ? 'dark' : 'light'}
      style={[
        styles.card,
        {
          backgroundColor: isLiquidGlassSupported
            ? 'transparent'
            : colors.card,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </LiquidGlassView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 20,
    // borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
