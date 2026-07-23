// createSlice: a helper from Redux Toolkit that lets us define
// a piece of state AND the actions that change it, all in one place.
// PayloadAction: a TypeScript type used to describe the data
// an action carries with it (its "payload").
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// This describes the shape of a single logged-in user's data.
// It matches the fields DummyJSON's login API returns.
type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
};

// This describes the shape of our ENTIRE auth state —
// everything Redux will remember about the user's login status.
type AuthState = {
  user: User | null;        // the logged-in user's info, or null if nobody's logged in
  token: string | null;     // the JWT token used to authenticate API requests
  isAuthenticated: boolean; // true if the user is currently logged in
};

// The starting values, before anyone logs in.
// Nobody is logged in yet, so everything is empty/false.
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// createSlice bundles together:
// 1. A name for this slice of state ("auth")
// 2. The starting state (initialState above)
// 3. The actions that are allowed to change this state (reducers below)
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    // This action runs when login succeeds.
    // "state" is the current auth state.
    // "action.payload" is whatever data we pass in when we call this action
    // (in our case: { user, token }).
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      // Even though this LOOKS like we're directly changing "state",
      // Redux Toolkit safely handles this behind the scenes (using a library called Immer).
      // You don't need to worry about the mechanics — just know this pattern is safe here.
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    // This action runs when the user logs out (manually, or automatically on a 401 error).
    // It resets everything back to the "nobody's logged in" state.
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// We export the two actions (loginSuccess, logout) so that other files
// (like LoginScreen.tsx or the Axios interceptor) can trigger them
// using: dispatch(loginSuccess({ user, token })) or dispatch(logout())
export const { loginSuccess, logout } = authSlice.actions;

// We export the reducer itself (the "brain" that responds to those actions)
// so it can be plugged into the main Redux store in store.ts
export default authSlice.reducer;