
import React, { memo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';

import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TextInput from '../../components/ui/TextInput';
import Button from '../../components/ui/Button';

import type { SigninScreenProps } from '../../navigation/types/navigation.types';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import {
  login,
  clearAuthError,
  selectAuthLoading,
  selectAuthError,
} from '../../store/feature/auth/authSlice';

import { signinSchema } from '../../schema/auth.schema';

import { useToast } from '../../providers/ToastProvider';
import { isIOS } from '../../utils/os';

function Signin({ navigation }: SigninScreenProps) {
  const { colors } = useTheme();
  const { showToast } = useToast();

  const dispatch = useAppDispatch();

  const isSubmitting = useAppSelector(selectAuthLoading);
  const authError = useAppSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const onSubmit = async () => {
    if (isSubmitting) return;

    Keyboard.dismiss();

    const result = signinSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0] ?? '',
        password: fieldErrors.password?.[0] ?? '',
      });

      return;
    }

    setErrors({
      email: '',
      password: '',
    });

    if (authError) {
      dispatch(clearAuthError());
    }

    try {
      await dispatch(login(result.data)).unwrap();

      showToast(
        'Welcome back!',
        'success',
        'Login successful',
      );
    } catch (error) {
      showToast(
        'Login unsuccessful!',
        'error',
        'Authentication failed',
      );

      console.error('Signin failed:', error);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={isIOS ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={isIOS ? 'interactive' : 'on-drag'}
        >
          <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Welcome Back
              </Text>

              <Text style={[styles.subtitle, { color: colors.text }]}>
                Sign in to continue using Notifier.
              </Text>
            </View>

            {/* Email */}
            <TextInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={(value) => {
                setEmail(value);

                if (errors.email) {
                  setErrors(prev => ({
                    ...prev,
                    email: '',
                  }));
                }

                if (authError) {
                  dispatch(clearAuthError());
                }
              }}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              returnKeyType="next"
            />

            {/* Password */}
            <TextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);

                if (errors.password) {
                  setErrors(prev => ({
                    ...prev,
                    password: '',
                  }));
                }

                if (authError) {
                  dispatch(clearAuthError());
                }
              }}
              error={errors.password}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />

            {/* Sign In Button */}
            <Button
              mode="contained"
              onPress={onSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              buttonColor={colors.primary}
              textColor="#FFFFFF"
              style={styles.signInButton}
            >
              Sign In
            </Button>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border },
                ]}
              />

              <Text style={[styles.orText, { color: colors.text }]}>
                OR
              </Text>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border },
                ]}
              />
            </View>

            {/* Sign Up */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: colors.text }]}>
                Don't have an account?
              </Text>

              <Pressable
                onPress={() => navigation.navigate('Signup')}
              >
                <Text
                  style={[
                    styles.signupLink,
                    { color: colors.primary },
                  ]}
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 18,
  },

  header: {
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
    opacity: 0.65,
  },

  signInButton: {
    marginTop: 8,
    width: '100%',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },

  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },

  orText: {
    fontSize: 13,
    marginHorizontal: 16,
    opacity: 0.65,
    fontWeight: '500',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },

  signupText: {
    fontSize: 14,
  },

  signupLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default memo(Signin);
