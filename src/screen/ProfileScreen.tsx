import React from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

// useQuery: fetches and caches data automatically (for reading data)
// useMutation: performs a one-off write/update action (for changing data)
// useQueryClient: lets us manually update React Query's cache after a mutation
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// The AUTHENTICATED Axios instance — automatically attaches the token
// and automatically logs the user out if it gets a 401 back.
import authAxiosInstance from '../api/authAxiosInstance';

import { logout } from '../redux/authSlice';
import type { AppDispatch } from '../redux/store';

// This is the actual function that fetches the profile data.
// React Query will call this automatically when the screen loads.
const fetchProfile = async () => {
  const response = await authAxiosInstance.get('/auth/me');
  return response.data;
};

// This is the function that performs the "update" action.
// It's only called when we explicitly trigger it (button tap),
// unlike fetchProfile which runs automatically.
const updateFirstName = async (newFirstName: string) => {
  const response = await authAxiosInstance.put('/users/1', {
    firstName: newFirstName,
  });
  return response.data;
};

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();

  // Gives us access to React Query's internal cache,
  // so we can manually update cached data after a successful mutation.
  const queryClient = useQueryClient();

  // useQuery automatically:
  // - calls fetchProfile() when the screen loads
  // - tracks loading/error/success states for us
  // - caches the result under the key 'profile'
  const {
    data: profile,       // the fetched data (renamed to "profile" here)
    isLoading,            // true only during the very first fetch
    isError,               // true if fetchProfile() throws an error
    refetch,                // a function we can call to manually re-fetch
    isRefetching,             // true while a manual refetch is happening
  } = useQuery({
    queryKey: ['profile'],    // a unique label for this cached data
    queryFn: fetchProfile,     // the function that actually fetches it
  });

  // useMutation sets up the "update" action, but does NOT run it
  // automatically — it only runs when we call mutation.mutate(...).
  const mutation = useMutation({
    mutationFn: updateFirstName,

    // This runs automatically after a successful mutation.
    onSuccess: (updatedData) => {
      // Manually update the cached profile data with the new first name,
      // so the screen reflects the change immediately without
      // needing to wait for a full refetch.
      queryClient.setQueryData(['profile'], (old: any) => ({
        ...old,
        firstName: updatedData.firstName,
      }));
    },
  });

  // Dispatching logout() resets Redux's auth state.
  // RootNavigator is watching isAuthenticated, so this automatically
  // swaps the app back to AuthStack — no manual navigation needed.
  const handleLogout = () => {
    dispatch(logout());
  };

  // Triggers the mutation defined above, passing in a new name.
  const handleUpdateName = () => {
    mutation.mutate('UpdatedName');
  };

  // While the very first fetch is happening, show a spinner
  // and nothing else.
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  // If fetching failed, show an error message with a Retry button
  // that calls refetch() to try again.
  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Failed to load profile.</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  // If we reach here, data loaded successfully — show the profile.
  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.image }} style={styles.avatar} />
      <Text style={styles.name}>
        {profile.firstName} {profile.lastName}
      </Text>
      <Text style={styles.email}>{profile.email}</Text>

      {/* Pull-to-refresh alternative: a button that calls refetch() */}
      <Button
        title={isRefetching ? 'Refreshing...' : 'Refresh Profile'}
        onPress={() => refetch()}
        disabled={isRefetching}
      />
      <View style={styles.spacer} />

      {/* Triggers the useMutation defined above */}
      <Button
        title={mutation.isPending ? 'Updating...' : 'Update First Name'}
        onPress={handleUpdateName}
        disabled={mutation.isPending}
      />
      <View style={styles.spacer} />

      {/* A TEST button — deliberately sends a fake/invalid token to Redux,
          simulating what happens when a real token expires.
          This lets us test the 401 auto-logout without waiting for
          a real token to actually expire. */}
      <Button
        title="Corrupt Token (test 401)"
        color="#f39c12"
        onPress={() => {
          dispatch({
            type: 'auth/loginSuccess',
            payload: { user: profile, token: 'invalid-token' },
          });
        }}
      />
      <View style={styles.spacer} />

      <Button title="Log Out" color="#e74c3c" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#555', marginBottom: 20 },
  error: { color: '#e74c3c', marginBottom: 12 },
  spacer: { height: 12 },
});