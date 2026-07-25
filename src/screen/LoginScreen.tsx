import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';

// useDispatch: the hook that lets a component SEND an action to Redux
// (as opposed to useSelector, which is used to READ from Redux).
import { useDispatch } from 'react-redux';

// The plain, public Axios instance — used here because at login time,
// we don't have a token yet (we're trying to GET one).
import axiosInstance from '../api/axiosInstance';

// The action we built in authSlice.ts — dispatching this updates
// Redux's auth state and marks the user as logged in.
import { loginSuccess } from '../redux/authSlice';

// A TypeScript helper type so useDispatch knows the exact shape
// of our store's dispatch function.
import type { AppDispatch } from '../redux/store';

export default function LoginScreen() {
  // Grabs the dispatch function so we can send actions to Redux later.
  const dispatch = useDispatch<AppDispatch>();

  // Pre-filled with the test credentials, just to make testing faster.
  // (In a real app, these would start empty.)
  const [username, setUsername] = useState<string>('kminchelle');
  const [password, setPassword] = useState<string>('0lelplR');

  // Tracks whether the login request is currently in progress,
  // so we can show a spinner and disable the button while waiting.
  const [loading, setLoading] = useState<boolean>(false);

  // Holds an error message if login fails — starts as null (no error).
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);  // show the spinner
    setError(null);    // clear any old error message before trying again

    try {
      // Send a POST request to DummyJSON's login endpoint,
      // with the username/password the user typed in.
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
      });

      // DummyJSON's response includes the token MIXED IN with the
      // user's other fields, all in one object. This line separates them:
      // "token" gets pulled out on its own, and everything else
      // (id, username, email, etc.) gets bundled into "user".
      const { token, ...user } = response.data;

      // Send this data to Redux. This updates isAuthenticated to true,
      // which RootNavigator is watching — so the app automatically
      // switches from AuthStack to AppStack. We don't need to manually
      // navigate anywhere ourselves!
      dispatch(loginSuccess({ user, token }));

    } catch (err) {
      // If the request fails (wrong credentials, network error, etc.),
      // show a friendly error message instead of crashing.
      setError('Invalid username or password. Please try again.');

    } finally {
      // "finally" always runs, whether the request succeeded or failed.
      // We use it here to make sure the spinner always turns off.
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none" // don't auto-capitalize usernames
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // masks the typed characters, standard for passwords
      />

      {/* Only show the error text if "error" actually has a message in it */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Show a spinner while loading; otherwise show the actual button */}
      {loading ? (
        <ActivityIndicator size="large" color="#2ecc71" />
      ) : (
        <Button title="Log In" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  error: { color: '#e74c3c', marginBottom: 12, textAlign: 'center' },
});