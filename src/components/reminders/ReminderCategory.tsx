
import React, { memo } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { FormSection } from '../ui/Field';
import type { ReminderCategory as ReminderCategoryType } from '../../types/reminder.types';

interface Props {
    value: ReminderCategoryType;
    onChange: (value: ReminderCategoryType) => void;
}

const CATEGORIES: {
    label: string;
    value: ReminderCategoryType;
    icon: string;
}[] = [
        { label: 'Personal', value: 'personal', icon: 'account-outline' },
        { label: 'Work', value: 'work', icon: 'briefcase-outline' },
        { label: 'Health', value: 'health', icon: 'heart-pulse' },
        { label: 'Other', value: 'other', icon: 'dots-horizontal' },
    ];

function ReminderCategory({ value, onChange }: Props) {
    const { colors } = useTheme();

    return (
        <FormSection title="Category">
            <View style={styles.container}>
                <FlatList
                    data={CATEGORIES}
                    keyExtractor={item => item.value}
                    horizontal // Remove this prop if you want a vertical list
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const selected = value === item.value;

                        return (
                            <Pressable
                                onPress={() => onChange(item.value)}
                                style={[
                                    styles.category,
                                    {
                                        backgroundColor: selected ? colors.primary : colors.card,
                                        borderColor: selected ? colors.primary : colors.border,
                                    },
                                ]}
                            >
                                <MaterialDesignIcons
                                    name={item.icon as any}
                                    size={20}
                                    color={selected ? '#FFFFFF' : colors.text}
                                />

                                <Text
                                    style={[
                                        styles.label,
                                        { color: selected ? '#FFFFFF' : colors.text },
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </Pressable>
                        );
                    }}
                />

            </View>
        </FormSection>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    category: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginRight: 10,

    },
    label: {
        fontSize: 13,
        fontWeight: '600',
    },
    p3:{
        padding: 2
    }
});

export default memo(ReminderCategory);
