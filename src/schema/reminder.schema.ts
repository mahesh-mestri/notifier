
import { z } from 'zod';
import {
  format,
  isBefore,
  isValid,
  parse,
  startOfDay,
} from 'date-fns';

/* ----------------------------------
   Common validation
----------------------------------- */

const dateSchema = z.string().refine((value) => {
  const date = parse(value, 'yyyy-MM-dd', new Date());

  return (
    isValid(date) &&
    format(date, 'yyyy-MM-dd') === value
  );
}, 'Please select a valid date');

const timeSchema = z.string().regex(
  /^([01]\d|2[0-3]):([0-5]\d)$/,
  'Please enter a valid time (HH:mm)',
);

const timeZoneSchema = z.string()
  .trim()
  .min(1, 'Timezone is required')
  .refine((value) => {
    try {
      new Intl.DateTimeFormat('en-US', {
        timeZone: value,
      });
      return true;
    } catch {
      return false;
    }
  }, 'Please enter a valid timezone');

const optionalEndDateSchema = dateSchema.optional();

const isPastDate = (value: string) => {
  const date = parse(value, 'yyyy-MM-dd', new Date());

  return isBefore(startOfDay(date), startOfDay(new Date()));
};

const isEndDateBeforeStartDate = (
  endDate: string,
  startDate: string,
) => endDate < startDate;

/* ----------------------------------
   Schedule schemas
----------------------------------- */

// Once
const onceScheduleSchema = z.object({
  type: z.literal('once'),
  date: dateSchema,
  time: timeSchema,
  timeZone: timeZoneSchema,
}).superRefine((data, ctx) => {
  if (isPastDate(data.date)) {
    ctx.addIssue({
      code: 'custom',
      path: ['date'],
      message: 'Date cannot be in the past',
    });
  }
});

// Interval
const intervalScheduleSchema = z.object({
  type: z.literal('interval'),
  startDate: dateSchema,
  intervalValue: z.number()
    .int('Interval must be a whole number')
    .min(1, 'Interval must be at least 1'),
  intervalUnit: z.enum(['minutes', 'hours']),
  windowStartTime: timeSchema,
  windowEndTime: timeSchema,
  endDate: optionalEndDateSchema,
  timeZone: timeZoneSchema,
}).superRefine((data, ctx) => {
  if (data.windowEndTime <= data.windowStartTime) {
    ctx.addIssue({
      code: 'custom',
      path: ['windowEndTime'],
      message: 'End time must be after start time',
    });
  }

  if (
    data.endDate &&
    isEndDateBeforeStartDate(data.endDate, data.startDate)
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['endDate'],
      message: 'End date must be after or equal to start date',
    });
  }

  if (isPastDate(data.startDate)) {
    ctx.addIssue({
      code: 'custom',
      path: ['startDate'],
      message: 'Start date cannot be in the past',
    });
  }

  const intervalInMinutes =
    data.intervalUnit === 'hours'
      ? data.intervalValue * 60
      : data.intervalValue;

  if (intervalInMinutes > 1440) {
    ctx.addIssue({
      code: 'custom',
      path: ['intervalValue'],
      message: 'Interval cannot exceed 24 hours',
    });
  }
});

// Daily
const dailyScheduleSchema = z.object({
  type: z.literal('daily'),
  startDate: dateSchema,
  time: timeSchema,
  endDate: optionalEndDateSchema,
  timeZone: timeZoneSchema,
}).superRefine((data, ctx) => {
  if (data.endDate && isEndDateBeforeStartDate(data.endDate, data.startDate)) {
    ctx.addIssue({
      code: 'custom',
      path: ['endDate'],
      message: 'End date must be after or equal to start date',
    });
  }

  if (isPastDate(data.startDate)) {
    ctx.addIssue({
      code: 'custom',
      path: ['startDate'],
      message: 'Start date cannot be in the past',
    });
  }
});

// Weekly
const weeklyScheduleSchema = z.object({
  type: z.literal('weekly'),
  startDate: dateSchema,
  time: timeSchema,
  weekdays: z.array(
    z.number().int().min(0).max(6),
  ).min(1, 'Select at least one weekday')
    .refine(
      (days) => new Set(days).size === days.length,
      'Duplicate weekdays are not allowed',
    ),
  endDate: optionalEndDateSchema,
  timeZone: timeZoneSchema,
}).superRefine((data, ctx) => {
  if (data.endDate && isEndDateBeforeStartDate(data.endDate, data.startDate)) {
    ctx.addIssue({
      code: 'custom',
      path: ['endDate'],
      message: 'End date must be after or equal to start date',
    });
  }

  if (isPastDate(data.startDate)) {
    ctx.addIssue({
      code: 'custom',
      path: ['startDate'],
      message: 'Start date cannot be in the past',
    });
  }
});

// Monthly
const monthlyScheduleSchema = z.object({
  type: z.literal('monthly'),
  startDate: dateSchema,
  time: timeSchema,
  dayOfMonth: z.number()
    .int('Day must be a whole number')
    .min(1, 'Day must be between 1 and 31')
    .max(31, 'Day must be between 1 and 31'),
  endDate: optionalEndDateSchema,
  timeZone: timeZoneSchema,
}).superRefine((data, ctx) => {
  if (data.endDate && isEndDateBeforeStartDate(data.endDate, data.startDate)) {
    ctx.addIssue({
      code: 'custom',
      path: ['endDate'],
      message: 'End date must be after or equal to start date',
    });
  }

  if (isPastDate(data.startDate)) {
    ctx.addIssue({
      code: 'custom',
      path: ['startDate'],
      message: 'Start date cannot be in the past',
    });
  }
});

/* ----------------------------------
   Discriminated schedule union
----------------------------------- */

export const reminderScheduleSchema = z.discriminatedUnion(
  'type',
  [
    onceScheduleSchema,
    intervalScheduleSchema,
    dailyScheduleSchema,
    weeklyScheduleSchema,
    monthlyScheduleSchema,
  ],
);

/* ----------------------------------
   Reminder schema
----------------------------------- */

export const reminderSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Reminder title is required')
    .max(100, 'Title cannot exceed 100 characters'),

  description: z
    .string()
    .trim()
    .refine(
      value => value.length === 0 || (value.length >= 5 && value.length <= 10),
      {
        message: 'Description must be empty or contain atleast 5-10 characters',
      },
    ),

  categoryId: z.enum([
    'personal',
    'work',
    'health',
    'other',
  ]),

  schedule: reminderScheduleSchema,

  notificationEnabled: z.boolean(),
});

/* ----------------------------------
   Inferred types
----------------------------------- */

export type ReminderScheduleFormData = z.infer<
  typeof reminderScheduleSchema
>;

export type CreateReminderFormData = z.infer<
  typeof reminderSchema
>;
