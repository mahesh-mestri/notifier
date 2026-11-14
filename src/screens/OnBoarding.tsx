
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@react-navigation/native';

import * as Keychain from 'react-native-keychain';

import { AuthStackParamList } from '../navigation/types/navigation.types';
import Button from '../components/ui/Button';

import NeverMissThing from '../components/onboarding/NeverMissThing';
import RemindersOnTime from '../components/onboarding/RemindersOnTime';
import StayOrganized from '../components/onboarding/StayOrganized';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

type OnboardingSlide = {
  id: string;
  component: React.ComponentType;
};

const ONBOARDING_SERVICE = 'com.notifier.onboarding';

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'never-miss',
    component: NeverMissThing,
  },
  {
    id: 'reminders-on-time',
    component: RemindersOnTime,
  },
  {
    id: 'stay-organized',
    component: StayOrganized,
  },
];

function Onboarding({ navigation }: Props) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecking, setIsChecking] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  const isLastSlide = currentIndex === onboardingSlides.length - 1;

  // Check whether onboarding was already completed.
  useEffect(() => {
    let isMounted = true;

    const checkOnboardingStatus = async () => {
      try {
        const credentials = await Keychain.getGenericPassword({
          service: ONBOARDING_SERVICE,
        });

        const completed =
          credentials !== false && credentials.password === 'completed';

        if (completed && isMounted) {
          navigation.replace('Signin');
          return;
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    checkOnboardingStatus();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  // Save onboarding completion before navigating to Signin.
  const completeOnboarding = useCallback(async () => {
    if (isCompleting) {
      return;
    }

    try {
      setIsCompleting(true);

      await Keychain.setGenericPassword(
        'onboarding',
        'completed',
        {
          service: ONBOARDING_SERVICE,
        },
      );

      navigation.replace('Signin');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
      setIsCompleting(false);
    }
  }, [isCompleting, navigation]);

  const handleNext = useCallback(() => {
    if (isLastSlide) {
      completeOnboarding();
      return;
    }

    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  }, [completeOnboarding, currentIndex, isLastSlide]);

  const handleSkip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);

      setCurrentIndex(index);
    },
    [width],
  );

  const renderSlide = useCallback(
    ({ item }: { item: OnboardingSlide }) => {
      const SlideComponent = item.component;

      return (
        <View style={[styles.slide, { width }]}>
          <SlideComponent />
        </View>
      );
    },
    [width],
  );

  // Avoid showing onboarding while checking saved completion status.
  if (isChecking) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.text }]}>
          Notifier
        </Text>

        {!isLastSlide && (
          <Pressable
            onPress={handleSkip}
            disabled={isCompleting}
            hitSlop={10}
          >
            <Text
              style={[
                styles.skipText,
                { color: colors.primary },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        )}
      </View>

      {/* Onboarding slides */}
      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={onboardingSlides}
          keyExtractor={(item) => item.id}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Pagination */}
        <View style={styles.pagination}>
          {onboardingSlides.map((slide, index) => {
            const isActive = currentIndex === index;

            return (
              <View
                key={slide.id}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.border,
                    width: isActive ? 24 : 8,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Continue / Get Started */}
        <Button
          mode="contained"
          onPress={handleNext}
          loading={isCompleting}
          disabled={isCompleting}
          buttonColor={colors.primary}
          textColor="#FFFFFF"
          style={styles.button}
        >
          {isLastSlide ? 'Get Started' : 'Continue'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 60,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 8,
  },
  button: {
    width: '100%',
  },
});

export default memo(Onboarding);
