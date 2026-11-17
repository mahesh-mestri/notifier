
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@react-navigation/native';

// Adjust if your Button component is in another folder.
import Button from '../ui/Button';

export type ReminderPickerField =
  | 'start'
  | 'end'
  | 'time'
  | 'windowStart'
  | 'windowEnd'
  | 'reminderTime';


export interface ReminderPickerOptions {
  field: ReminderPickerField;
  value: Date;
  minimumDate?: Date;
}

export interface ReminderDateTimeBottomSheetRef {
  open: (options: ReminderPickerOptions) => void;
  close: () => void;
}

interface Props {
  onConfirm: (field: ReminderPickerField, date: Date) => void;
}

const ReminderDateTimeBottomSheet = forwardRef<
  ReminderDateTimeBottomSheetRef,
  Props
>(({ onConfirm }, ref) => {
  const { colors, dark } = useTheme();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['55%'], []);

  const [field, setField] =
    useState<ReminderPickerField>('start');

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [minimumDate, setMinimumDate] =
    useState<Date | undefined>();

  const isTimePicker = field === 'time';

  const title = isTimePicker
    ? 'Select Reminder Time'
    : field === 'start'
      ? 'Select Start Date'
      : 'Select End Date';

  useImperativeHandle(ref, () => ({
    open: options => {
      setField(options.field);
      setSelectedDate(options.value);
      setMinimumDate(options.minimumDate);

      bottomSheetRef.current?.present();
    },

    close: () => {
      bottomSheetRef.current?.dismiss();
    },
  }));

  const handleConfirm = () => {
    onConfirm(field, selectedDate);
    bottomSheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}
      backgroundStyle={{
        backgroundColor: colors.card,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.text,
        opacity: 0.3,
      }}
    >
      <BottomSheetView style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>

        <DateTimePicker
          testID="reminder-date-time-picker"
          value={selectedDate}
          mode={isTimePicker ? 'time' : 'date'}
          display="spinner"
          is24Hour
          onValueChange={(_: any, date: Date) => {
            setSelectedDate(date);
          }}
          minimumDate={
            isTimePicker ? undefined : minimumDate
          }
          themeVariant={dark ? 'dark' : 'light'}
        />

        <Button
          mode="contained"
          buttonColor={colors.primary}
          textColor="#FFFFFF"
          onPress={handleConfirm}
          style={styles.confirmButton}
        >
          Done
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ReminderDateTimeBottomSheet.displayName =
  'ReminderDateTimeBottomSheet';

export default ReminderDateTimeBottomSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },

  confirmButton: {
    marginTop: 12,
  },
});
