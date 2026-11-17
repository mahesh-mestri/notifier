
import React from 'react';
import { View } from 'react-native';

import ReminderTypeSelector from './ReminderTypeSelector';
import OneTimeSchedule from './schedule/OneTimeSchedule';
import IntervalSchedule from './schedule/IntervalSchedule';
import DailySchedule from './schedule/DailySchedule';
import WeeklySchedule from './schedule/WeeklySchedule';
import MonthlySchedule from './schedule/MonthlySchedule';

export type ReminderType =
    | 'once'
    | 'interval'
    | 'daily'
    | 'weekly'
    | 'monthly';

export type IntervalUnit = 'minutes' | 'hours';

export type SchedulePickerField =
    | 'start'
    | 'end'
    | 'time'
    | 'windowStart'
    | 'windowEnd';

export interface ReminderScheduleValue {
    type: ReminderType;
    startDate: Date;
    endDate: Date | null;
    reminderTime: Date;
    intervalValue: number;
    intervalUnit: IntervalUnit;
    windowStartTime: Date;
    windowEndTime: Date;
    weekdays: number[];
    dayOfMonth: number;
}

export interface ScheduleFieldsProps {
    value: ReminderScheduleValue;
    onChange: (changes: Partial<ReminderScheduleValue>) => void;
    onPickDate: (
        field: SchedulePickerField,
        value: Date,
        minimumDate?: Date,
    ) => void;
}

interface Props {
    value: ReminderScheduleValue;
    onChange: (value: ReminderScheduleValue) => void;
    onPickDate: ScheduleFieldsProps['onPickDate'];
}

export default function ReminderScheduleForm({
    value,
    onChange,
    onPickDate,
}: Props) {
    const update = (changes: Partial<ReminderScheduleValue>) => {
        onChange({ ...value, ...changes });
    };

    const fieldProps: ScheduleFieldsProps = {
        value,
        onChange: update,
        onPickDate,
    };

    return (
        <View>
            <ReminderTypeSelector
                value={value.type}
                onChange={type => update({ type })}
            />

            {value.type === 'once' && (
                <OneTimeSchedule {...fieldProps} />
            )}

            {value.type === 'interval' && (
                <IntervalSchedule {...fieldProps} />
            )}

            {value.type === 'daily' && (
                <DailySchedule {...fieldProps} />
            )}

            {value.type === 'weekly' && (
                <WeeklySchedule {...fieldProps} />
            )}

            {value.type === 'monthly' && (
                <MonthlySchedule {...fieldProps} />
            )}
        </View>
    );
}
