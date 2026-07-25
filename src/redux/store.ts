// configureStore: builds the actual Redux store (the single place
// where all your app's global state lives).
// combineReducers: merges multiple "slices" of state into one
// (right now we only have "auth", but you could add more later).
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// These are all pieces from redux-persist — the library that
// automatically saves your Redux state to the device's storage,
// and restores it when the app reopens.
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// AsyncStorage is the actual storage mechanism redux-persist will use
// to save data on the device (same tool you used in an earlier task).
import AsyncStorage from '@react-native-async-storage/async-storage';

// The reducer we built in authSlice.ts
import authReducer from './authSlice';

// Combine all your slices into ONE root reducer.
// Right now there's only one slice ("auth"), but if you added
// more slices later (like "settings" or "cart"), you'd list them here too.
const rootReducer = combineReducers({
  auth: authReducer,
});

// This config tells redux-persist exactly HOW to save your state:
const persistConfig = {
  key: 'root',           // a label used internally by redux-persist
  storage: AsyncStorage,  // WHERE to save it (on-device storage)
  whitelist: ['auth'],    // WHICH slices to save — only "auth" gets persisted
};

// Wraps your rootReducer with persistence behavior,
// based on the config above.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// This actually creates the Redux store — the real, live object
// that holds your app's global state while it's running.
export const store = configureStore({
  reducer: persistedReducer,

  // redux-persist internally dispatches some special actions
  // that aren't plain, "serializable" data (a technical Redux requirement).
  // This tells Redux Toolkit: "these specific actions are fine, don't warn about them."
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// This creates the "persistor" — the engine that actually performs
// the saving/restoring. You'll use this in App.tsx, wrapped around
// your whole app inside a component called <PersistGate>.
export const persistor = persistStore(store);

// These two lines are just TypeScript helpers.
// RootState = "the exact shape of everything in our store"
// AppDispatch = "the exact type of the dispatch function"
// You'll use these later so TypeScript can correctly check
// useSelector() and useDispatch() calls in your screens.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;