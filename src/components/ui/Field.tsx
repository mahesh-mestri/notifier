import { useTheme } from "@react-navigation/native";
import { StyleProp, StyleSheet, Switch, Text, View, ViewStyle } from "react-native";
import { memo } from 'react'
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export function FieldError({ message }: { message?: string }) {
    const { colors } = useTheme();

    if (!message) return null;

    return (
        <Text style={{ color: colors.notification, fontSize: 12, marginTop: 6 }}>
            {message}
        </Text>
    );
}



/* ----------------------------------
   Form Section
----------------------------------- */

export function FormSection({
    title,
    children,
    style = {}
}: {
    title: string;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>
}) {
    const { colors } = useTheme();

    return (
        <View style={[styles.formSection, style]}>
            <Text style={[styles.label, { color: colors.text }]}>
                {title}
            </Text>
            {children}
        </View>
    );
}

/* ----------------------------------
   Setting Row
----------------------------------- */

export function SettingRow({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
}: {
    icon: string;
    title: string;
    subtitle: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.settingRow,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
            ]}
        >
            <MaterialDesignIcons
                name={icon as any}
                size={23}
                color={colors.primary}
            />

            <View style={styles.settingText}>
                <Text
                    style={[
                        styles.settingTitle,
                        { color: colors.text },
                    ]}
                >
                    {title}
                </Text>

                <Text
                    style={[
                        styles.helperText,
                        { color: colors.text },
                    ]}
                >
                    {subtitle}
                </Text>
            </View>

            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{
                    false: '#767577',
                    true: colors.primary,
                }}
                style={{ alignSelf: 'center' }}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    intro: {
        marginBottom: 26,
    },

    subtitle: {
        fontSize: 13,
        opacity: 0.65,
        marginTop: 6,
    },

    formSection: {
        marginBottom: 22,
    },

    label: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 10,
    },

    input: {
        minHeight: 52,
        borderWidth: 1,
        borderRadius: 13,
        paddingHorizontal: 15,
        fontSize: 14,
    },

    descriptionInput: {
        minHeight: 105,
        paddingTop: 14,
    },

    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 9,
    },

    categoryButton: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 17,
        paddingVertical: 11,
    },

    settingRow: {
        minHeight: 72,
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },

    settingText: {
        flex: 1,
    },

    settingTitle: {
        fontSize: 13,
        fontWeight: '600',
    },

    helperText: {
        fontSize: 11,
        opacity: 0.6,
        marginTop: 4,
    },

    saveButton: {
        marginTop: 8,
    },
});
