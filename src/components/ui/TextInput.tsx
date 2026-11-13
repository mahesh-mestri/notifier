
import React, { forwardRef, memo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
} from 'react-native';

import type {
  TextInputProps as RNTextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { useTheme } from '@react-navigation/native';

type Props = RNTextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

type NativeTextInputRef = React.ComponentRef<typeof RNTextInput>;

const TextInput = forwardRef<NativeTextInputRef, Props>(
  (
    {
      label,
      error,
      secureTextEntry = false,
      containerStyle,
      style,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const { colors } = useTheme();

    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const hasError = Boolean(error);

    const borderColor = hasError
      ? colors.notification
      : isFocused
        ? colors.primary
        : colors.border;

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label */}
        {label && (
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
          </Text>
        )}

        {/* Input */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
              borderColor,
            },
          ]}
        >
          <RNTextInput
            ref={ref}
            {...props}
            secureTextEntry={secureTextEntry && !showPassword}
            placeholderTextColor={colors.text + '80'}
            selectionColor={colors.primary}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            style={[
              styles.input,
              { color: colors.text },
              style,
            ]}
          />

          {/* Password Visibility */}
          {secureTextEntry && (
            <Pressable
              onPress={() => setShowPassword((previous) => !previous)}
              hitSlop={10}
              style={styles.passwordToggle}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? 'Hide password' : 'Show password'
              }
            >
              <MaterialDesignIcons
                name={showPassword ? 'eye-off' : 'eye'}
                color={colors.text}
                size={22}
              />
            </Pressable>
          )}
        </View>

        {/* Error */}
        {hasError && (
          <Text
            style={[
              styles.error,
              { color: colors.notification },
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    minHeight: 54,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    minHeight: 52,
  },
  passwordToggle: {
    marginLeft: 10,
    padding: 4,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 2,
  },
});

export default memo(TextInput);
