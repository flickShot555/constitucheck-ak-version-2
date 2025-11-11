import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LandingScreen from '../screens/LandingScreen';
import SettingsScreen from '../screens/SettingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Landing" component={LandingScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}