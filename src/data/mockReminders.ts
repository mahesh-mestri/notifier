import type { Category, Reminder } from '../types/reminder.types';

const todayAt = (hour: number, minute: number) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Take medicine',
    description: 'After lunch',
    categoryId: 'health',
    scheduledAt: todayAt(12, 30),
    status: 'completed',
    isRecurring: true,
    notificationEnabled: true,
  },
  {
    id: '2',
    title: 'Project meeting',
    description: 'Discuss sprint progress',
    categoryId: 'work',
    scheduledAt: todayAt(14, 0),
    status: 'pending',
    isRecurring: false,
    notificationEnabled: true,
  },
  {
    id: '3',
    title: 'Evening workout',
    description: '30 minutes exercise',
    categoryId: 'personal',
    scheduledAt: todayAt(18, 0),
    status: 'pending',
    isRecurring: true,
    notificationEnabled: true,
  },
  {
    id: '4',
    title: 'Read a book',
    categoryId: 'personal',
    scheduledAt: todayAt(20, 0),
    status: 'pending',
    isRecurring: false,
    notificationEnabled: true,
  },
  {
    id: '5',
    title: 'Plan tomorrow',
    categoryId: 'work',
    scheduledAt: todayAt(21, 0),
    status: 'pending',
    isRecurring: false,
    notificationEnabled: true,
  },
];

export const mockCategories: Category[] = [
  { id: 'health', name: 'Health', icon: '♥', color: '#16A34A' },
  { id: 'work', name: 'Work', icon: '▣', color: '#2563EB' },
  { id: 'personal', name: 'Personal', icon: '☆', color: '#9333EA' },
  { id: 'other', name: 'Other', icon: '•••', color: '#EA580C' },
];