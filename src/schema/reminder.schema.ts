import { z } from 'zod';
import {
  format,
  isBefore,
  isValid,
  parse,
  startOfDay,
} from 'date-fns';
import { Weekday } from '../types/reminder.types';

/* ----------------------------------
   Common validation
----------------------------------- */

const parseIsoDate = (value: string) =>
  parse(value, 'yyyy-MM-dd', new Date());

const dateSchema = z.string().refine(value => {
  const date = parseIsoDate(value);

  return (
    isValid(date) &&
    format(date, 'yyyy-MM-dd') === value
  );
}, 'Please select a valid date');

const timeSchema = z.string().regex(
  /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/,
  'Please enter a valid time (HH:mm or HH:mm:ss)',
);

const timeZoneSchema = z.string()
  .trim()
  .min(1, 'Timezone is required')
  .refine(value => {
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

const isPastDate = (value: string) =>
  isBefore(startOfDay(parseIsoDate(value)), startOfDay(new Date()));

const isEndDateBeforeStartDate = (
  endDate: string,
  startDate: string,
) => isBefore(parseIsoDate(endDate), parseIsoDate(startDate));

/* ----------------------------------
   Schedule schemas
----------------------------------- */

// Once
const onceScheduleSchema = z.object({
  type: z.literal('ONCE'),
  reminderDate: dateSchema,
  reminderTime: timeSchema,
  timeZone: timeZoneSchema,
}).superRefine((data, ctx) => {
  if (isPastDate(data.reminderDate)) {
    ctx.addIssue({
      code: 'custom',
      path: ['reminderDate'],
      message: 'Date cannot be in the past',
    });
  }
});

// Interval
const intervalScheduleSchema = z.object({
  type: z.literal('INTERVAL'),
  startDate: dateSchema,
  intervalValue: z.number()
    .int('Interval must be a whole number')
    .min(1, 'Interval must be at least 1'),
  intervalUnit: z.enum(['MINUTES', 'HOURS']),
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
    data.intervalUnit === 'HOURS'
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
  type: z.literal('DAILY'),
  startDate: dateSchema,
  reminderTime: timeSchema,
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

const weekdaySchema = z
  .number()
  .int()
  .min(0)
  .max(6)
  .transform(day => day as Weekday);

// Weekly
const weeklyScheduleSchema = z
  .object({
    type: z.literal('WEEKLY'),
    startDate: dateSchema,
    reminderTime: timeSchema,
    weekdays: z
      .array(weekdaySchema)
      .min(1, 'Select at least one weekday')
      .refine(
        days => new Set(days).size === days.length,
        'Duplicate weekdays are not allowed',
      ),
    endDate: optionalEndDateSchema,
    timeZone: timeZoneSchema,
  })
  .superRefine((data, ctx) => {
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
  });

// Monthly
const monthlyScheduleSchema = z.object({
  type: z.literal('MONTHLY'),
  startDate: dateSchema,
  reminderTime: timeSchema,
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
   Schedule type schema
----------------------------------- */

export const scheduleTypeSchema = z.enum([
  'ONCE',
  'INTERVAL',
  'DAILY',
  'WEEKLY',
  'MONTHLY',
]);

/* ----------------------------------
   Reminder schema
----------------------------------- */

export const reminderSchema = z
  .object({
    title: z.string()
      .trim()
      .min(1, 'Reminder title is required')
      .max(100, 'Title cannot exceed 100 characters'),

    description: z
      .string()
      .trim()
      .max(500, 'Description cannot exceed 500 characters')
      .optional()
      .transform(value => (value && value.length > 0 ? value : undefined)),

    categoryId: z.enum([
      'PERSONAL',
      'WORK',
      'HEALTH',
      'OTHER',
    ]),

    scheduleType: scheduleTypeSchema,

    schedule: reminderScheduleSchema,

    notificationEnabled: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.scheduleType !== data.schedule.type) {
      ctx.addIssue({
        code: 'custom',
        path: ['scheduleType'],
        message: 'Schedule type must match the selected schedule',
      });
    }
  });

/* ----------------------------------
   Inferred types
----------------------------------- */

export type ScheduleTypeFormData = z.infer<
  typeof scheduleTypeSchema
>;

export type ReminderScheduleFormData = z.infer<
  typeof reminderScheduleSchema
>;

export type CreateReminderFormData = z.infer<
  typeof reminderSchema
>;