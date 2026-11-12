
import React, { memo, useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, useTheme } from 'react-native-paper';
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
  const theme = useTheme();
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

  const handleSkip = () => navigation.replace('Signin');

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
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.logo}>
          Notifier
        </Text>

        {!isLastSlide && (
          <Button mode="text" onPress={handleSkip} compact>
            Skip
          </Button>
        )}
      </View>

      <FlatList
        scrollEnabled={false}
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
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

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              style={[
                styles.dot,
                {
                  width: currentIndex === index ? 24 : 9,
                  backgroundColor:
                    currentIndex === index
                      ? '#007AFF'
                      : theme.colors.surfaceVariant,
                },
              ]}
            />
          ))}
        </View>

        <Button
          mode="contained"
          onPress={handleNext}
          buttonColor="#007AFF"
          style={styles.button}
          contentStyle={styles.buttonContent}
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
  header: {
    height: 52,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: '#007AFF',
    fontWeight: '700',
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
    borderRadius: 16,
  },
  buttonContent: {
    height: 54,
  },
});

export default memo(Onboarding);
