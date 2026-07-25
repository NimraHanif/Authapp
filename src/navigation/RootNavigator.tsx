import React from 'react';

// useSelector: the hook that lets a component READ from Redux
// (opposite of useDispatch, which SENDS actions to Redux).
import { useSelector } from 'react-redux';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import type { RootState } from '../redux/store';

// This is the single decision point for the WHOLE app.
// It watches one specific value in Redux: isAuthenticated.
export default function RootNavigator() {
  // "state" here represents the ENTIRE Redux store.
  // We drill down to just the one value we care about: state.auth.isAuthenticated
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Whenever isAuthenticated changes (login or logout),
  // this component automatically re-renders and swaps
  // which entire stack is being shown — no manual navigation needed.
  return isAuthenticated ? <AppStack /> : <AuthStack />;
}