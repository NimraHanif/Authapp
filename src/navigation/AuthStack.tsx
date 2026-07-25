import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screen/LoginScreen';

const Stack = createNativeStackNavigator();

// This stack ONLY contains screens a logged-out user should see.
// Right now that's just LoginScreen — but you could add
// "Sign Up" or "Forgot Password" screens here later too.
export default function AuthStack() {
  return (
    // headerShown: false hides the default top bar/title on this stack,
    // since a login screen usually doesn't need one.
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}