import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { PlatformCard } from '../ui/card';
import type { VitalUpdate } from '../../types/profile.types';

type Props = {
  updates: VitalUpdate[];
  onViewAll: () => void;
  onUpdatePress: (update: VitalUpdate) => void;
};

const updateIcons = {
  announcement: 'bullhorn-outline',
  tip: 'lightbulb-outline',
  feature: 'star-outline',
} as const;

export default function VitalUpdatesCard({
  updates,
  onViewAll,
  onUpdatePress,
}: Props) {
  const { colors } = useTheme();

  const latestUpdates = updates.slice(0, 2);

  return (
    <PlatformCard style={styles.card}>
      {latestUpdates.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text + '99' }]}>
          You're all caught up!
        </Text>
      ) : (
        latestUpdates.map((update, index) => (
          <React.Fragment key={update.id}>
            <Pressable
              onPress={() => onUpdatePress(update)}
              style={styles.item}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + '15' },
                ]}
              >
                <MaterialDesignIcons
                  name={updateIcons[update.type]}
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {update.title}
                </Text>

                <Text
                  style={[styles.description, { color: colors.text + '99' }]}
                  numberOfLines={2}
                >
                  {update.description}
                </Text>

                <Text style={[styles.date, { color: colors.text + '80' }]}>
                  {update.date}
                </Text>
              </View>

              {!update.isRead && <View style={styles.unreadDot} />}

              <MaterialDesignIcons
                name="chevron-right"
                size={22}
                color={colors.text + '80'}
              />
            </Pressable>

            {index < latestUpdates.length - 1 && (
              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border },
                ]}
              />
            )}
          </React.Fragment>
        ))
      )}

      <Pressable onPress={onViewAll} style={styles.viewAll}>
        <Text style={[styles.viewAllText, { color: colors.primary }]}>
          View all updates
        </Text>

        <MaterialDesignIcons
          name="arrow-right"
          size={17}
          color={colors.primary}
        />
      </Pressable>
    </PlatformCard>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingVertical: 13,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  description: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },
  date: {
    fontSize: 10,
    marginTop: 5,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    gap: 5,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    paddingVertical: 14,
    fontSize: 13,
  },
});