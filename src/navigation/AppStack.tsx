import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';


const Stack = createNativeStackNavigator();

// This stack ONLY contains screens a logged-in user should see.
// A logged-out user can never reach these screens, because
// this entire stack only gets rendered once isAuthenticated is true.
export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}