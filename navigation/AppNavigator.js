import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from './AuthStack';
import MainDrawer from './MainDrawer';
import ChatScreen from "../screens/ChatScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator({ isLoggedIn, setIsLoggedIn }) {
  return isLoggedIn
    ? (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainDrawer" component={MainDrawer} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    ) 
    : (
      <AuthStack setIsLoggedIn={setIsLoggedIn} />
    );
}