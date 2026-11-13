import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import { PlatformCard } from '../ui/card';
import type { Category } from '../../types/reminder.types';

interface Props {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  onSeeAll: () => void;
}

export default function CategorySection({
  categories,
  onCategoryPress,
  onSeeAll,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Categories
        </Text>

        <Pressable onPress={onSeeAll}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>
            View all
          </Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.list}>
          {categories.map(category => (
            <Pressable
              key={category.id}
              onPress={() => onCategoryPress(category)}
            >
              <PlatformCard style={styles.card}>
                <View
                  style={[
                    styles.icon,
                    { backgroundColor: category.color + '18' },
                  ]}
                >
                  <Text style={{ color: category.color, fontSize: 20 }}>
                    {category.icon}
                  </Text>
                </View>

                <Text style={[styles.name, { color: colors.text }]}>
                  {category.name}
                </Text>
              </PlatformCard>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  list: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 4,
  },
  card: {
    width: 110,
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
  },
});