
import React, { useEffect } from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@react-navigation/native';

import GlassCard from '../card/GlassCard';

type ToastType = 'success' | 'error' | 'info';

type Props = {
  visible: boolean;
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
};

const COLORS = {
  success: '#22C55E',
  error: '#EF4444',
  info: '#3B82F6',
};

const ICONS = {
  success: '✓',
  error: '!',
  info: 'i',
};

export default function GlassToast({
  visible,
  message,
  title = 'Notifier',
  type = 'info',
  duration = 2500,
  onHide,
}: Props) {
  const { colors } = useTheme();

  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  }));

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 18,
        stiffness: 150,
      });

      opacity.value = withTiming(1, {
        duration: 200,
      });

      const timeout = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timeout);
    }

    hideToast();
  }, [visible, duration]);

  const hideToast = () => {
    translateY.value = withTiming(-120, {
      duration: 250,
    });

    opacity.value = withTiming(0, {
      duration: 200,
    });
  };

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.container,
        animatedStyle,
      ]}
    >
      <GlassCard
        effect="regular"
        interactive
        style={styles.glass}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: COLORS[type] },
            ]}
          >
            <Text style={styles.icon}>
              {ICONS[type]}
            </Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>

            <Text style={[styles.message, { color: colors.text }]}>
              {message}
            </Text>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  glass: {
    padding: 0,
    borderRadius: 22,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  message: {
    fontSize: 13,
    opacity: 0.8,
  },
});
