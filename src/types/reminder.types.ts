/* ----------------------------------
   Reminder enums and basic types
----------------------------------- */

export type ReminderCategory =
  | 'PERSONAL'
  | 'WORK'
  | 'HEALTH'
  | 'OTHER';

export type ReminderStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'MISSED';

export type scheduleType =
  | 'ONCE'
  | 'INTERVAL'
  | 'DAILY'
  | 'WEEKLY'
  | 'MONTHLY';

export type IntervalUnit = 'MINUTES' | 'HOURS';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/* ----------------------------------
   Schedule configurations
   API / Backend representation
----------------------------------- */

export interface OnceSchedule {
  type: 'ONCE';
  reminderDate: string; // YYYY-MM-DD
  reminderTime: string; // HH:mm
  timeZone: string;     // Asia/Kolkata
}

export interface IntervalSchedule {
  type: 'INTERVAL';
  startDate: string;
  intervalValue: number;
  intervalUnit: IntervalUnit;
  windowStartTime: string;
  windowEndTime: string;
  endDate?: string;
  timeZone: string;
}

export interface DailySchedule {
  type: 'DAILY';
  startDate: string;
  reminderTime: string;
  endDate?: string;
  timeZone: string;
}

export interface WeeklySchedule {
  type: 'WEEKLY';
  startDate: string;
  reminderTime: string;
  weekdays: Weekday[];
  endDate?: string;
  timeZone: string;
}

export interface MonthlySchedule {
  type: 'MONTHLY';
  startDate: string;
  reminderTime: string;
  dayOfMonth: number;
  endDate?: string;
  timeZone: string;
}

/* ----------------------------------
   Discriminated schedule union
----------------------------------- */

export type ReminderSchedule =
  | OnceSchedule
  | IntervalSchedule
  | DailySchedule
  | WeeklySchedule
  | MonthlySchedule;

/* ----------------------------------
   Reminder master entity
----------------------------------- */

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  categoryId: ReminderCategory;
  schedule: ReminderSchedule;
  notificationEnabled: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ----------------------------------
   Reminder occurrence
   Individual scheduled execution
----------------------------------- */

export interface ReminderOccurrence {
  id: string;
  reminderId: string;
  scheduledAt: string;
  status: ReminderStatus;
  completedAt?: string;
  createdAt: string;
}

/* ----------------------------------
   API request types
----------------------------------- */

export interface CreateReminderRequest {
  title: string;
  description?: string;
  categoryId: ReminderCategory;
  scheduleType: scheduleType;
  schedule: ReminderSchedule;
  notificationEnabled: boolean;
}

export interface UpdateReminderRequest {
  title?: string;
  description?: string;
  categoryId?: ReminderCategory;
  scheduleType?: scheduleType;
  schedule?: ReminderSchedule;
  notificationEnabled?: boolean;
  active?: boolean;
}

/* ----------------------------------
   Occurrence request types
----------------------------------- */

export interface CompleteOccurrenceRequest {
  completedAt?: string;
}

/* ----------------------------------
   API response types
----------------------------------- */

export interface ReminderResponse extends Reminder {}

export interface ReminderOccurrenceResponse
  extends ReminderOccurrence {}

/* ----------------------------------
   Reminder filters
----------------------------------- */

export interface ReminderFilters {
  categoryId?: ReminderCategory;
  scheduleType?: scheduleType;
  active?: boolean;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
}

/* ----------------------------------
   Occurrence filters
----------------------------------- */

export interface ReminderOccurrenceFilters {
  reminderId?: string;
  status?: ReminderStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sortDirection?: 'asc' | 'desc';
}

/* ----------------------------------
   Paginated responses
----------------------------------- */

export interface ReminderListResponse {
  content: Reminder[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ReminderOccurrenceListResponse {
  content: ReminderOccurrence[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/* ----------------------------------
   Dashboard summaries
----------------------------------- */

export interface ReminderSummary {
  total: number;
  pending: number;
  completed: number;
  missed: number;
}

export interface ReminderCategorySummary {
  categoryId: ReminderCategory;
  count: number;
}

/* ----------------------------------
   React Native form values
----------------------------------- */

export interface ReminderFormValues {
  title: string;
  description: string;
  categoryId: ReminderCategory;

  scheduleType: scheduleType;

  startDate: Date;
  endDate: Date | null;

  reminderTime: Date;

  intervalValue: number;
  intervalUnit: IntervalUnit;

  windowStartTime: Date;
  windowEndTime: Date;

  selectedWeekdays: Weekday[];

  dayOfMonth: number;

  notificationEnabled: boolean;
}

/* ----------------------------------
   Form validation errors
----------------------------------- */

export type ReminderFormErrors = Partial<
  Record<keyof ReminderFormValues | 'schedule', string>
>;

/* ----------------------------------
   Date/time picker targets
----------------------------------- */

export type ReminderPickerTarget =
  | 'start'
  | 'end'
  | 'time'
  | 'windowStart'
  | 'windowEnd';