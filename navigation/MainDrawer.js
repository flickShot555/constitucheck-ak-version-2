import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/LandingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function MainDrawer() {
  return (
    <Stack.Navigator 
      initialRouteName="Landing" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}