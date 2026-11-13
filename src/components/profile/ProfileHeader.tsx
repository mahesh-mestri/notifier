import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { PlatformCard } from '../ui/card';
import type { UserProfile } from '../../types/profile.types';

type Props = {
  user: UserProfile;
  onEditPress: () => void;
};

export default function ProfileHeader({ user, onEditPress }: Props) {
  const { colors } = useTheme();

  const initial = user.name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <PlatformCard style={styles.card}>
      <View style={styles.container}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            {user.name}
          </Text>

          <Text style={[styles.email, { color: colors.text + '99' }]}>
            {user.email}
          </Text>

          <Text style={[styles.accountType, { color: colors.primary }]}>
            {user.accountType}
          </Text>
        </View>

        <Pressable onPress={onEditPress} hitSlop={10}>
          <MaterialDesignIcons
            name="pencil-outline"
            size={22}
            color={colors.primary}
          />
        </Pressable>
      </View>
    </PlatformCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 17,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
  },
  email: {
    fontSize: 12,
    marginTop: 4,
  },
  accountType: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
  },
});