import React from 'react';
import { Platform } from 'react-native';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';

import type { BottomTabParamList } from '../types/navigation.types';

import HomeScreen from '../../screens/tabs/HomeScreen';
import RemindersScreen from '../../screens/tabs/RemindersScreen';
import CategoriesScreen from '../../screens/tabs/CategoriesScreen';
import ProfileScreen from '../../screens/tabs/ProfileScreen';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

const Tab = createNativeBottomTabNavigator<BottomTabParamList>();

// Pre-compute Android image sources at module scope
const androidIcons =
  Platform.OS === 'android'
    ? {
        homeFilled: MaterialDesignIcons.getImageSourceSync('home', 24, '#2563EB'),
        homeOutline: MaterialDesignIcons.getImageSourceSync('home-outline', 24, '#9CA3AF'),
        calendarFilled: MaterialDesignIcons.getImageSourceSync('calendar', 24, '#2563EB'),
        calendarOutline: MaterialDesignIcons.getImageSourceSync('calendar-outline', 24, '#9CA3AF'),
        gridFilled: MaterialDesignIcons.getImageSourceSync('view-grid', 24, '#2563EB'),
        gridOutline: MaterialDesignIcons.getImageSourceSync('view-grid-outline', 24, '#9CA3AF'),
        profileFilled: MaterialDesignIcons.getImageSourceSync('account-circle', 24, '#2563EB'),
        profileOutline: MaterialDesignIcons.getImageSourceSync('account-circle-outline', 24, '#9CA3AF'),
      }
    : null;

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      sidebarAdaptable
      labeled={false}
      scrollEdgeAppearance="transparent"
      tabBarInactiveTintColor="#9CA3AF"
      tabBarActiveTintColor="#2563EB"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) =>
            Platform.OS === 'ios'
              ? { sfSymbol: focused ? 'house.fill' : 'house' }
              : focused
              ? androidIcons!.homeFilled
              : androidIcons!.homeOutline,
        }}
      />

      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          title: 'Reminders',
          tabBarIcon: ({ focused }) =>
            Platform.OS === 'ios'
              ? { sfSymbol: 'calendar' }
              : focused
              ? androidIcons!.calendarFilled
              : androidIcons!.calendarOutline,
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused }) =>
            Platform.OS === 'ios'
              ? { sfSymbol: focused ? 'square.grid.2x2.fill' : 'square.grid.2x2' }
              : focused
              ? androidIcons!.gridFilled
              : androidIcons!.gridOutline,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) =>
            Platform.OS === 'ios'
              ? { sfSymbol: focused ? 'person.crop.circle.fill' : 'person.crop.circle' }
              : focused
              ? androidIcons!.profileFilled
              : androidIcons!.profileOutline,
        }}
      />
    </Tab.Navigator>
  );
}
