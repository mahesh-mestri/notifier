import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

type Props = PropsWithChildren<{
  title: string;
  action?: string;
  onAction?: () => void;
}>;

export default function ProfileSection({
  title,
  action,
  onAction,
  children,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>

        {action && (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={[styles.action, { color: colors.primary }]}>
              {action}
            </Text>
          </Pressable>
        )}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  action: {
    fontSize: 13,
    fontWeight: '600',
  },
});