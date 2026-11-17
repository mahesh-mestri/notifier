
import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  Pressable,
} from 'react-native';

import { useTheme } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import TextInput from '../../components/ui/TextInput';
import type { AuthStackParamList } from '../../navigation/types/navigation.types';
import { signupSchema } from '../../schema/auth.schema';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

function Signup({ navigation }: Props) {
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    Keyboard.dismiss();

    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0] ?? '',
        email: fieldErrors.email?.[0] ?? '',
        password: fieldErrors.password?.[0] ?? '',
        confirmPassword: fieldErrors.confirmPassword?.[0] ?? '',
      });

      return;
    }

    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    try {
      setIsSubmitting(true);

      console.log('Signup data:', {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
      });

      // Call your signup API here.
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Create Account
            </Text>

            <Text style={[styles.subtitle, { color: colors.text }]}>
              Create your account and stay on top of everything.
            </Text>
          </View>

          {/* Name */}
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: '' }));
              }
            }}
            error={errors.name}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />

          {/* Email */}
          <TextInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: '' }));
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
            placeholder="Create a password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: '' }));
              }
              if (errors.confirmPassword) {
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: '',
                }));
              }
            }}
            error={errors.password}
            secureTextEntry
            returnKeyType="next"
          />

          {/* Confirm Password */}
          <TextInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: '',
                }));
              }
            }}
            error={errors.confirmPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />

          {/* Signup Button */}
          <Pressable
            onPress={onSubmit}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.signupButton,
              {
                backgroundColor: colors.primary,
                opacity: isSubmitting ? 0.6 : pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Text>
          </Pressable>

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

          {/* Sign In */}
          <View style={styles.signinContainer}>
            <Text style={[styles.signinText, { color: colors.text }]}>
              Already have an account?
            </Text>

            <Pressable onPress={() => navigation.goBack()}>
              <Text style={[styles.signinLink, { color: colors.primary }]}>
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  signupButton: {
    marginTop: 8,
    width: '100%',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  signinText: {
    fontSize: 14,
  },
  signinLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default memo(Signup);
