export type ReminderStatus =
  | 'pending'
  | 'completed'
  | 'snoozed'
  | 'missed';

export type ReminderCategory =
  | 'health'
  | 'work'
  | 'personal'
  | 'other';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  categoryId: ReminderCategory;
  scheduledAt: string;
  status: ReminderStatus;
  isRecurring: boolean;
  notificationEnabled: boolean;
}

export interface Category {
  id: ReminderCategory;
  name: string;
  icon: string;
  color: string;
}