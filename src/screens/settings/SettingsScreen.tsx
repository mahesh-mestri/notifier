
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { PlatformCard } from '../../components/ui/card';

import {
  defaultNotificationSettings,
  getNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
} from '../../services/settings';


export default function SettingsScreen({ navigation }: any) {
  const { colors, dark } = useTheme();

  const [settings, setSettings] = useState<NotificationSettings>(
    defaultNotificationSettings,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const savedSettings = await getNotificationSettings();

        if (mounted) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.warn('Unable to load notification settings:', error);
      } finally {
        if (mounted) {
          setIsLoaded(true);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof NotificationSettings>(
      key: K,
      value: NotificationSettings[K],
    ) => {
      const updatedSettings = {
        ...settings,
        [key]: value,
      };

      setSettings(updatedSettings);

      try {
        await saveNotificationSettings(updatedSettings);
      } catch (error) {
        console.warn('Unable to save notification settings:', error);
        Alert.alert(
          'Unable to save',
          'Your setting could not be saved. Please try again.',
        );
      }
    },
    [settings],
  );

  const handleSnoozeDuration = () => {
    const options = [5, 10, 15, 30];

    Alert.alert('Snooze Duration', 'Choose your preferred snooze duration.', [
      ...options.map((minutes) => ({
        text: `${minutes} minutes`,
        onPress: () => updateSetting('snoozeMinutes', minutes),
      })),
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ]);
  };

  const handleFirstDay = () => {
    Alert.alert(
      'First Day of Week',
      'The first-day-of-week preference is not implemented yet.',
    );
  };

  const handleLanguage = () => {
    Alert.alert(
      'Language',
      'Language selection is not implemented yet.',
    );
  };

  const handleQuietHours = () => {
    Alert.alert(
      'Quiet Hours',
      'Quiet hours are currently set to 10:00 PM – 7:00 AM. Editing the time range will be available later.',
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // TODO:
            // Clear the authentication session and reset
            // navigation to the AuthStack.
          },
        },
      ],
    );
  };

  const openPrivacy = () => navigation.navigate('PrivacySecurity');
  const openBackup = () => navigation.navigate('DataBackup');
  const openSupport = () => navigation.navigate('HelpSupport');
  const openAbout = () => navigation.navigate('About');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior='always'
    >
      <SettingsSection
        title="Notifications"
        subtitle="Manage your notification preferences"
      >
        <PlatformCard style={styles.menuCard}>
          <SettingSwitch
            icon="bell-outline"
            title="Reminders"
            subtitle="Receive notifications for your reminders"
            value={settings.remindersEnabled}
            onValueChange={(value) =>
              updateSetting('remindersEnabled', value)
            }
          />

          <Divider />

          <SettingSwitch
            icon="volume-high"
            title="Sound"
            subtitle="Play sound for reminder notifications"
            value={settings.soundEnabled}
            onValueChange={(value) =>
              updateSetting('soundEnabled', value)
            }
            disabled={!settings.remindersEnabled}
          />

          <Divider />

          <SettingSwitch
            icon="vibrate"
            title="Vibration"
            subtitle="Vibrate when a reminder arrives"
            value={settings.vibrationEnabled}
            onValueChange={(value) =>
              updateSetting('vibrationEnabled', value)
            }
            disabled={!settings.remindersEnabled}
          />

          <Divider />

          <SettingSwitch
            icon="calendar-today"
            title="Daily Summary"
            subtitle="Receive a summary of your daily reminders"
            value={settings.dailySummaryEnabled}
            onValueChange={(value) =>
              updateSetting('dailySummaryEnabled', value)
            }
          />
        </PlatformCard>
      </SettingsSection>

      {/* Reminder Preferences */}
      <SettingsSection
        title="Reminder Preferences"
        subtitle="Customize your reminder behavior"
      >
        <PlatformCard style={styles.menuCard}>
          <SettingsMenuRow
            icon="clock-outline"
            title="Snooze Duration"
            subtitle="Choose how long to postpone a reminder"
            value={`${settings.snoozeMinutes} minutes`}
            onPress={handleSnoozeDuration}
          />

          <Divider />

          <SettingSwitch
            icon="moon-waning-crescent"
            title="Quiet Hours"
            subtitle="Pause notifications during specific hours"
            value={settings.quietHoursEnabled}
            onValueChange={(value) =>
              updateSetting('quietHoursEnabled', value)
            }
          />

          {settings.quietHoursEnabled && (
            <>
              <Divider />
              <SettingsMenuRow
                icon="clock-time-four-outline"
                title="Quiet Hours Schedule"
                subtitle="10:00 PM – 7:00 AM"
                onPress={handleQuietHours}
              />
            </>
          )}
        </PlatformCard>
      </SettingsSection>

      {/* General */}
      <SettingsSection
        title="General"
        subtitle="Manage your app preferences"
      >
        <PlatformCard style={styles.menuCard}>
          <SettingsMenuRow
            icon="calendar-week"
            title="First Day of Week"
            value="Monday"
            onPress={handleFirstDay}
          />

          <Divider />

          <SettingsMenuRow
            icon="translate"
            title="Language"
            value="English"
            onPress={handleLanguage}
          />
        </PlatformCard>
      </SettingsSection>

      {/* Account & Support */}
      <SettingsSection
        title="Account & Support"
        subtitle="Manage your account and get help"
      >
        <PlatformCard style={styles.menuCard}>
          <SettingsMenuRow
            icon="shield-check-outline"
            title="Privacy & Security"
            onPress={openPrivacy}
          />

          <Divider />

          <SettingsMenuRow
            icon="database-outline"
            title="Data & Backup"
            onPress={openBackup}
          />

          <Divider />

          <SettingsMenuRow
            icon="help-circle-outline"
            title="Help & Support"
            onPress={openSupport}
          />

          <Divider />

          <SettingsMenuRow
            icon="information-outline"
            title="About Notifier"
            value="1.0.0"
            onPress={openAbout}
          />
        </PlatformCard>
      </SettingsSection>

      {/* Sign Out */}
      <Pressable
        onPress={handleSignOut}
        style={[
          styles.signOutButton,
          {
            backgroundColor: dark ? '#DC26261A' : '#DC262610',
          },
        ]}
      >
        <MaterialDesignIcons
          name="logout"
          size={20}
          color="#DC2626"
        />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <Text style={[styles.footerText, { color: colors.text }]}>
        Notifier · Version 1.0.0
      </Text>
    </ScrollView>
  );
}

/* ----------------------------------
   Settings Section
----------------------------------- */

type SettingsSectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

function SettingsSection({
  title,
  subtitle,
  children,
}: SettingsSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.text, opacity: 0.6 },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {children}
    </View>
  );
}

/* ----------------------------------
   Settings Switch
----------------------------------- */

type SettingSwitchProps = {
  icon: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

function SettingSwitch({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}: SettingSwitchProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.menuRow, disabled && styles.disabledRow]}>
      <View style={styles.menuIcon}>
        <MaterialDesignIcons
          name={icon as any}
          size={22}
          color={disabled ? colors.text : colors.primary}
        />
      </View>

      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: colors.text }]}>
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={[
              styles.menuSubtitle,
              { color: colors.text, opacity: 0.6 },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: '#767577',
          true: colors.primary,
        }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

/* ----------------------------------
   Settings Menu Row
----------------------------------- */

type SettingsMenuRowProps = {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
};

function SettingsMenuRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
}: SettingsMenuRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuRow,
        pressed && styles.pressedRow,
      ]}
    >
      <View style={styles.menuIcon}>
        <MaterialDesignIcons
          name={icon as any}
          size={22}
          color={colors.primary}
        />
      </View>

      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: colors.text }]}>
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={[
              styles.menuSubtitle,
              { color: colors.text, opacity: 0.6 },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {value ? (
        <Text style={[styles.menuValue, { color: colors.text }]}>
          {value}
        </Text>
      ) : null}

      <MaterialDesignIcons
        name="chevron-right"
        size={21}
        color={colors.text}
        style={{ opacity: 0.45 }}
      />
    </Pressable>
  );
}

/* ----------------------------------
   Divider
----------------------------------- */

function Divider() {
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

/* ----------------------------------
   Styles
----------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },

  section: {
    marginBottom: 26,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },

  menuCard: {
    paddingVertical: 2,
    paddingHorizontal: 14,
    borderRadius: 16,
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 66,
    paddingVertical: 12,
    gap: 12,
  },

  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuContent: {
    flex: 1,
    justifyContent: 'center',
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  menuSubtitle: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16,
  },

  menuValue: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.65,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 48,
  },

  pressedRow: {
    opacity: 0.65,
  },

  disabledRow: {
    opacity: 0.45,
  },

  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 4,
    padding: 15,
    borderRadius: 15,
  },

  signOutText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },

  footerText: {
    fontSize: 11,
    opacity: 0.45,
    textAlign: 'center',
    marginTop: 22,
  },
});
