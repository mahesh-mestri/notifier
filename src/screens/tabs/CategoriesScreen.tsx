import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  BottomTabParamList,
  AppStackParamList,
  CategoriesScreenProps,
} from '../../navigation/types/navigation.types';

import type { Category } from '../../types/category.types';

import { mockCategories } from '../../data/mockCategories';
import { mockReminders } from '../../data/mockReminders';

import CategoryCard from '../../components/categories/CategoryCard';
import CategorySearch from '../../components/categories/CategorySearch';
import CategorySummary from '../../components/categories/CategorySummary';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeBottomTabScreenProps } from '@bottom-tabs/react-navigation';


export default function CategoriesScreen({ navigation }: CategoriesScreenProps) {
  const { colors } = useTheme();
  const nav =
    navigation.getParent<NativeStackNavigationProp<AppStackParamList>>();

  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(
    () =>
      mockCategories.filter(category =>
        category.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [search],
  );

  const getReminderCount = (categoryId: string) =>
    mockReminders.filter(reminder => reminder.categoryId === categoryId).length;

  const totalReminderCount = mockReminders.length;

  const handleCategoryPress = (category: Category) => {
    // Later: open a category-specific reminders screen.
    console.log('Selected category:', category.id);
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredCategories}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[styles.content]}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            reminderCount={getReminderCount(item.id)}
            onPress={() => handleCategoryPress(item)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.heading}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Categories
                </Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                  Organize your reminders.
                </Text>
              </View>

              <Pressable
                onPress={() => nav?.navigate('CreateReminder')}
                style={[
                  styles.addButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.addButtonText}>+</Text>
              </Pressable>
            </View>

            <CategorySearch value={search} onChange={setSearch} />

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your categories
            </Text>
          </View>
        }
        ListFooterComponent={
          <CategorySummary
            categoryCount={mockCategories.length}
            reminderCount={totalReminderCount}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: colors.text }}>
              No categories found.
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior='always'
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 12,
    paddingBottom: 32,
  },
  header: {
    gap: 20,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.65,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 27,
    lineHeight: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  column: {
    justifyContent: 'space-between',
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});