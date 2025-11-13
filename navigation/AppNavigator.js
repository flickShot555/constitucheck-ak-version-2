import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from 'react-native';

import AuthStack from './AuthStack';
import MainDrawer from './MainDrawer';
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, initializing } = useAuth();

  // Show loading screen while checking auth state
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return user ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  ) : (
    <AuthStack />
  );
}