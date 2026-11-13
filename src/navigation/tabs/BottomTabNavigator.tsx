import React from 'react';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';

import type { BottomTabParamList } from '../types/navigation.types';

import HomeScreen from '../../screens/tabs/HomeScreen';
import RemindersScreen from '../../screens/tabs/RemindersScreen';
import CategoriesScreen from '../../screens/tabs/CategoriesScreen';
import ProfileScreen from '../../screens/tabs/ProfileScreen';

const Tab = createNativeBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      hapticFeedbackEnabled
      sidebarAdaptable
      labeled={false}
      scrollEdgeAppearance='transparent'
      tabBarInactiveTintColor='#9CA3AF'
      tabBarActiveTintColor="#2563EB"
      translucent={true}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'house.fill' : 'house',
          }),
        }}
      />

      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          title: 'Reminders',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'calendar.circle.fill' : 'calendar',
          }),
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'square.grid.2x2.fill' : 'square.grid.2x2',
          }),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => ({
            sfSymbol: focused ? 'person.crop.circle.fill' : 'person.crop.circle',
          }),
        }}
      />
    </Tab.Navigator>
  );
}