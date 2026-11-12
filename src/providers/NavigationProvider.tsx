import { View, Text } from 'react-native'
import React, { PropsWithChildren } from 'react'
import { NavigationContainer } from '@react-navigation/native'

export default function NavigationProvider({children}: PropsWithChildren) {
    return (
        <NavigationContainer
            // linking={linking}
            fallback={<Text>Loading navigation...</Text>}
        >
            {children}
        </NavigationContainer>
    )
}