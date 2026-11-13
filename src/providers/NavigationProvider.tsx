import React, { PropsWithChildren } from 'react';
import { Text, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { lightTheme, darkTheme } from '../utils/theme';

export default function NavigationProvider({
    children,
}: PropsWithChildren) {
    const colorScheme = useColorScheme();

    const activeTheme =
        colorScheme === 'dark' ? darkTheme : lightTheme;

    return (
        <NavigationContainer
            theme={activeTheme}
            fallback={<Text>Loading navigation...</Text>}
        >
            {children}
        </NavigationContainer>
    );
}