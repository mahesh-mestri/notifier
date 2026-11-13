
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
import { SafeAreaView } from 'react-native-safe-area-context';

import TextInput from '../../components/ui/TextInput';
import { AuthProps } from '../../navigation/types/navigation.types';

function Signin({navigation}: AuthProps) {
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    Keyboard.dismiss();

    const newErrors = {
      email: !email.trim() ? 'Email is required' : '',
      password: !password ? 'Password is required' : '',
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      setIsSubmitting(true);

      console.log('Signin data:', { email, password });

      // Call your signin API here.
    } catch (error) {
      console.error('Signin failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colors.background },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Welcome Back
            </Text>

            <Text style={[styles.subtitle, { color: colors.text }]}>
              Sign in to continue using Notifier.
            </Text>
          </View>

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

          <TextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: '' }));
              }
            }}
            error={errors.password}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />

          <Pressable
            onPress={onSubmit}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.signInButton,
              {
                backgroundColor: colors.primary,
                opacity: isSubmitting ? 0.6 : pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Text>
          </Pressable>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <Text style={[styles.orText, { color: colors.text }]}>
              OR
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: colors.text }]}>
              Don't have an account?
            </Text>

            <Pressable onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.signupLink, { color: colors.primary }]}>
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  signInButton: {
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
