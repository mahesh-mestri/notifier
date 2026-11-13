export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  accountType: string;
  joinedAt: string;
}

export interface ReminderAnalytics {
  accuracy: number;
  totalDue: number;
  completedOnTime: number;
  completedLate: number;
  missed: number;
  currentStreak: number;
  bestStreak: number;
}

export interface WeeklyActivity {
  day: string;
  completed: number;
  missed: number;
}

export interface DailyGoal {
  target: number;
  completed: number;
}

export interface VitalUpdate {
  id: string;
  title: string;
  description: string;
  type: 'announcement' | 'tip' | 'feature';
  date: string;
  isRead: boolean;
}

export interface ReminderAnalytics {
  accuracy: number;
  totalDue: number;
  completedOnTime: number;
  completedLate: number;
  missed: number;
  currentStreak: number;
  bestStreak: number;
}