import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// "navigation" is automatically passed to every screen by React Navigation.
// We type it as "any" here for simplicity — in a bigger project you'd
// give it a proper type, but this keeps things beginner-friendly.
export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      {/* Tapping this button navigates to the Profile screen.
          Note: this is a NORMAL navigation call, unlike Login/Logout —
          because moving between Home and Profile has nothing to do
          with auth state, it's just regular navigation within AppStack. */}
      <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});