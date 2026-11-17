
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

type ToastData = {
  title: string;
  message: string;
  type: ToastType;
  duration: number;
};

type ToastContextType = {
  showToast: (
    message: string,
    type?: ToastType,
    title?: string,
    duration?: number,
  ) => void;
  hideToast: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_CONFIG = {
  success: {
    color: '#22C55E',
    icon: '✓',
  },
  error: {
    color: '#EF4444',
    icon: '!',
  },
  info: {
    color: '#3B82F6',
    icon: 'i',
  },
};

export const ToastProvider = ({
  children,
}: React.PropsWithChildren) => {
  const insets = useSafeAreaInsets();

  const [toast, setToast] = useState<ToastData | null>(null);
  const [mounted, setMounted] = useState(false);

  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    translateY.value = withTiming(-150, {
      duration: 250,
    });

    opacity.value = withTiming(
      0,
      { duration: 180 },
      finished => {
        if (finished) {
          runOnJS(setMounted)(false);
        }
      },
    );
  }, [translateY, opacity]);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'info',
      title = type.toUpperCase(),
      duration = 3500,
    ) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      translateY.value = -150;
      opacity.value = 0;

      setToast({
        message,
        type,
        title,
        duration,
      });

      setMounted(true);
    },
    [translateY, opacity],
  );

  useEffect(() => {
    if (!mounted || !toast) {
      return;
    }

    translateY.value = withSpring(0, {
      damping: 18,
      stiffness: 160,
      mass: 0.8,
    });

    opacity.value = withTiming(1, {
      duration: 220,
    });

    timerRef.current = setTimeout(
      hideToast,
      toast.duration,
    );

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [mounted, toast, hideToast, translateY, opacity]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const swipeGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onUpdate(event => {
      // Only allow upward movement.
      translateY.value = Math.min(0, event.translationY);
    })
    .onEnd(event => {
      if (
        event.translationY < -50 ||
        event.velocityY < -500
      ) {
        runOnJS(hideToast)();
      } else {
        translateY.value = withSpring(0, {
          damping: 18,
          stiffness: 160,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateY: translateY.value,
      },
    ],
  }));

  const config = toast
    ? TOAST_CONFIG[toast.type]
    : null;

  return (
    <ToastContext.Provider
      value={{
        showToast,
        hideToast,
      }}
    >
      <View style={styles.root}>
        {children}

        {mounted && toast && config && (
          <Animated.View
            style={[
              styles.container,
              { top: insets.top + 10 },
              animatedStyle,
            ]}
          >
            <GestureDetector gesture={swipeGesture}>
              <Pressable onPress={hideToast}>
                <View style={styles.toast}>
                  <View style={styles.glassOverlay} />

                  <View style={styles.content}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: config.color,
                        },
                      ]}
                    >
                      <Text style={styles.icon}>
                        {config.icon}
                      </Text>
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.title}>
                        {toast.title}
                      </Text>

                      <Text
                        style={styles.message}
                        numberOfLines={2}
                      >
                        {toast.message}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: config.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              </Pressable>
            </GestureDetector>
          </Animated.View>
        )}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      'useToast must be used inside ToastProvider',
    );
  }

  return context;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 99999,
    elevation: 20,
  },
  toast: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(35, 35, 40, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 15,
        shadowOffset: {
          width: 0,
          height: 8,
        },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  glassOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.035)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 13,
    gap: 12,
  },
  iconContainer: {
    height: 36,
    width: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    lineHeight: 17,
  },
  statusDot: {
    height: 7,
    width: 7,
    borderRadius: 4,
  },
});
