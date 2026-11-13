import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type {
  BottomTabParamList,
  AppStackParamList,
} from '../../navigation/types/navigation.types';

import {
  ProfileHeader,
  ProfileAccuracyCard,
  ProfileStreakCard,
  ProfileSection,
  ProfileMenuItem,
  VitalUpdatesCard,
} from '../../components/profile';

import {
  mockUserProfile,
  mockReminderAnalytics,
  mockVitalUpdates,
} from '../../data/mockProfile';



export default function ProfileScreen({ navigation }: any) {
  const { colors } = useTheme();

  const openEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit Profile screen will be implemented next.');
  };

  const openInsights = () => {
    Alert.alert('Reminder Insights', 'Detailed analytics will be available here.');
  };

  const openDailyGoal = () => {
    Alert.alert('Daily Goal', 'You will be able to configure your daily goal here.');
  };

  const openUpdates = () => {
    Alert.alert('Vital Updates', 'Your updates screen will be implemented next.');
  };

  const handleUpdatePress = (update: { title: string }) => {
    Alert.alert(update.title, 'Update details will be available here.');
  };

  const openSettings = () => {
    navigation?.navigate('Settings');
  };

  const openNotifications = () => {
    navigation?.navigate('NotificationSettings');
  };

  const openSupport = () => {
    Alert.alert('Help & Support', 'Support information will be available here.');
  };

  const openPrivacy = () => {
    Alert.alert('Privacy & Security', 'Privacy settings will be available here.');
  };

  const openBackup = () => {
    Alert.alert('Data & Backup', 'Backup options will be available here.');
  };

  const openAbout = () => {
    Alert.alert('About Notifier', 'Notifier version 1.0.0');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // TODO: Clear authentication session and reset navigation.
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior='always'
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.heading, { color: colors.text }]}>
            Profile
          </Text>
          <Text style={[styles.subtitle, { color: colors.text + '99' }]}>
            Manage your account and preferences
          </Text>
        </View>

        <Pressable
          onPress={openSettings}
          style={[styles.settingsButton, { backgroundColor: colors.card }]}
        >
          <MaterialDesignIcons
            name="cog-outline"
            size={23}
            color={colors.text}
          />
        </Pressable>
      </View>

      <ProfileHeader
        user={mockUserProfile}
        onEditPress={openEditProfile}
      />

      {/* Consistency */}
      <ProfileSection title="Your Consistency">
        <ProfileAccuracyCard
          accuracy={mockReminderAnalytics.accuracy}
          period="Last 30 days"
        />

        <View style={styles.streakContainer}>
          <ProfileStreakCard
            currentStreak={mockReminderAnalytics.currentStreak}
            bestStreak={mockReminderAnalytics.bestStreak}
          />
        </View>

        <Pressable onPress={openInsights} style={styles.insightsButton}>
          <Text style={[styles.insightsText, { color: colors.primary }]}>
            View detailed insights
          </Text>
          <MaterialDesignIcons
            name="arrow-right"
            size={17}
            color={colors.primary}
          />
        </Pressable>
      </ProfileSection>

      {/* Personalization */}
      <ProfileSection title="Personalization">
        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="target"
            title="Daily Goal"
            subtitle="Configure your daily reminder target"
            onPress={openDailyGoal}
          />

          <MenuDivider />

          <ProfileMenuItem
            icon="palette-outline"
            title="Appearance"
            subtitle="Light, dark or system theme"
            onPress={openSettings}
          />

          <MenuDivider />

          <ProfileMenuItem
            icon="bell-outline"
            title="Notifications"
            subtitle="Manage sounds, vibration and alerts"
            onPress={openNotifications}
          />
        </View>
      </ProfileSection>

      {/* Vital Updates */}
      <ProfileSection title="What's New">
        <VitalUpdatesCard
          updates={mockVitalUpdates}
          onViewAll={openUpdates}
          onUpdatePress={handleUpdatePress}
        />
      </ProfileSection>

      {/* Account and Support */}
      <ProfileSection title="Account & Support">
        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="shield-check-outline"
            title="Privacy & Security"
            onPress={openPrivacy}
          />

          <MenuDivider />

          <ProfileMenuItem
            icon="database-outline"
            title="Data & Backup"
            onPress={openBackup}
          />

          <MenuDivider />

          <ProfileMenuItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={openSupport}
          />

          <MenuDivider />

          <ProfileMenuItem
            icon="information-outline"
            title="About Notifier"
            onPress={openAbout}
          />
        </View>
      </ProfileSection>

      {/* Sign Out */}
      <Pressable
        onPress={handleSignOut}
        style={styles.signOutButton}
      >
        <MaterialDesignIcons
          name="logout"
          size={20}
          color="#DC2626"
        />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <Text style={[styles.version, { color: colors.text + '80' }]}>
        Notifier · Version 1.0.0
      </Text>
    </ScrollView>
  );
}

function MenuDivider() {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: colors.border },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  heading: {
    fontSize: 27,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 5,
  },
  settingsButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakContainer: {
    marginTop: 12,
  },
  insightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  insightsText: {
    fontSize: 13,
    fontWeight: '700',
  },
  menuCard: {
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 28,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#DC262610',
  },
  signOutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },
  version: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
  },
});