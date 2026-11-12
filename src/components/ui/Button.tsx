
import React, { memo } from 'react';
import {
  Button as PaperButton,
} from 'react-native-paper';

import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<typeof PaperButton>;

function Button({
  mode = 'contained',
  loading = false,
  disabled = false,
  uppercase = false,
  buttonColor,
  textColor,
  rippleColor,
  style,
  contentStyle,
  labelStyle,
  children,
  ...props
}: ButtonProps) {
  const isContained = mode === 'contained';

  return (
    <PaperButton
      {...props}
      mode={mode}
      loading={loading}
      disabled={disabled}
      uppercase={uppercase}
      buttonColor={
        buttonColor ?? (isContained ? '#007AFF' : undefined)
      }
      textColor={
        textColor ?? (isContained ? '#FFFFFF' : undefined)
      }
      rippleColor={rippleColor ?? 'rgba(255,255,255,0.16)'}
      style={[
        {
          borderRadius: 14,
        },
        style,
      ]}
      contentStyle={[
        {
          minHeight: 48,
          paddingHorizontal: 20,
        },
        contentStyle,
      ]}
      labelStyle={[
        {
          fontSize: 16,
          fontWeight: '600',
          letterSpacing: 0,
        },
        labelStyle,
      ]}
    >
      {children}
    </PaperButton>
  );
}

export default memo(Button);
