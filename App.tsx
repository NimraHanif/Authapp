import React from 'react';

// Provider: makes the Redux store available to every component in the app
import { Provider } from 'react-redux';

// PersistGate: waits until redux-persist has finished restoring
// saved state from AsyncStorage, before showing the real app
import { PersistGate } from 'redux-persist/integration/react';

// QueryClient + QueryClientProvider: sets up React Query so it's
// available throughout the app, same idea as Redux's Provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';

import { store, persistor } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';

// Create ONE QueryClient instance for the whole app.
// This holds React Query's internal cache.
const queryClient = new QueryClient();

function App() {
  return (
    // 1. Makes the Redux store available everywhere (via useSelector/useDispatch)
    <Provider store={store}>

      {/* 2. Waits for redux-persist to finish loading saved auth state
             from AsyncStorage. While waiting, shows a spinner instead
             of flashing the wrong screen (e.g. briefly showing Login
             even though the user was already logged in). */}
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      >

        {/* 3. Makes React Query available everywhere (via useQuery/useMutation) */}
        <QueryClientProvider client={queryClient}>

          {/* 4. Required wrapper for React Navigation —
                 tracks which screen the user is currently on */}
          <NavigationContainer>

            {/* 5. Decides whether to show AuthStack or AppStack,
                   based on Redux's isAuthenticated value */}
            <RootNavigator />

          </NavigationContainer>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;