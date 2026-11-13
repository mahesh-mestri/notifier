
import React, { memo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../navigation/types/navigation.types';
import NeverMissThing from '../components/onboarding/NeverMissThing';
import RemindersOnTime from '../components/onboarding/RemindersOnTime';
import StayOrganized from '../components/onboarding/StayOrganized';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const slides = [
  { id: '1', component: NeverMissThing },
  { id: '2', component: RemindersOnTime },
  { id: '3', component: StayOrganized },
];

function Onboarding({ navigation }: Props) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigation.replace('Signin');
      return;
    }

    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  const handleSkip = () => {
    navigation.replace('Signin');
  };

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width,
    );

    setCurrentIndex(index);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.logo,
            { color: colors.primary },
          ]}
        >
          Notifier
        </Text>

        {!isLastSlide && (
          <Pressable
            onPress={handleSkip}
            hitSlop={10}
            style={styles.skipButton}
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

      {/* Onboarding Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
        renderItem={({ item }) => {
          const SlideComponent = item.component;

          return (
            <View style={{ width, flex: 1 }}>
              <SlideComponent />
            </View>
          );
        }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {/* Pagination */}
        <View style={styles.pagination}>
          {slides.map((slide, index) => {
            const isActive = currentIndex === index;

            return (
              <View
                key={slide.id}
                style={[
                  styles.dot,
                  {
                    width: isActive ? 24 : 9,
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Continue Button */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: '#FFFFFF' },
            ]}
          >
            {isLastSlide ? 'Get Started' : 'Continue'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    marginBottom: 28,
  },
  dot: {
    height: 9,
    borderRadius: 5,
  },
  button: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default memo(Onboarding);
