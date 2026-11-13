export const mockUserProfile = {
  id: 'user_001',
  name: 'Mahesh Mestri',
  email: 'mahesh@example.com',
  avatar: '',
  accountType: 'Personal Account',
  joinedAt: '2026-01-15',
};

export const mockReminderAnalytics = {
  accuracy: 85,
  totalDue: 20,
  completedOnTime: 17,
  completedLate: 0,
  missed: 3,
  currentStreak: 6,
  bestStreak: 12,
};

export const mockVitalUpdates = [
  {
    id: 'update_001',
    title: 'Welcome to Notifier',
    description: 'Stay organized and never miss important reminders.',
    type: 'announcement' as const,
    date: 'Nov 1, 2026',
    isRead: false,
  },
  {
    id: 'update_002',
    title: 'Build a daily routine',
    description: 'Use recurring reminders to build consistent habits.',
    type: 'tip' as const,
    date: 'Nov 5, 2026',
    isRead: false,
  },
];