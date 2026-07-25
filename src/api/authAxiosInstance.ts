import axios from 'axios';

// We import the Redux store directly (not a hook) because this file
// is NOT a React component — it's plain logic that runs outside of
// any screen. We can't use useSelector/useDispatch here, so instead
// we reach into the store directly using store.getState() and store.dispatch().
import { store } from '../redux/store';
import { logout } from '../redux/authSlice';

// This is a SEPARATE Axios instance from the plain one (axiosInstance.ts).
// This one is specifically for requests that REQUIRE the user to be
// logged in — like fetching their profile data.
const authAxiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ───────────────────────────────────────────────
// REQUEST INTERCEPTOR
// This code runs automatically BEFORE every single request
// made using authAxiosInstance — we don't have to call it manually.
// ───────────────────────────────────────────────
authAxiosInstance.interceptors.request.use((config) => {
  // Grab the current token directly from the Redux store.
  // (store.getState() gives us a snapshot of the entire Redux state right now.)
  const token = store.getState().auth.token;

  // If a token exists, attach it to this request's headers.
  // This is the standard way APIs expect a JWT to be sent:
  // "Authorization: Bearer <token>"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // We must always return the config, whether we changed it or not —
  // otherwise the request won't actually go out.
  return config;
});

// ───────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// This code runs automatically AFTER every response comes back
// from a request made using authAxiosInstance.
// ───────────────────────────────────────────────
authAxiosInstance.interceptors.response.use(
  // First function: runs when the response is SUCCESSFUL.
  // We don't need to change anything, so we just pass it through as-is.
  (response) => response,

  // Second function: runs when the response is an ERROR
  // (like a 401, 404, 500, or a network failure).
  (error) => {
    // Check specifically for a 401 status code.
    // 401 means "Unauthorized" — usually this means the token
    // is missing, invalid, or expired.
    if (error.response && error.response.status === 401) {
      // Automatically log the user out by dispatching the logout action.
      // Because RootNavigator is watching isAuthenticated (via useSelector),
      // this single line will instantly swap the whole app back to AuthStack —
      // no manual navigation code needed anywhere else in the app.
      store.dispatch(logout());
    }

    // We still need to "reject" this error so that whichever code
    // originally made the request (e.g. useQuery) knows it failed,
    // and can show its own error state if needed.
    return Promise.reject(error);
  }
);

export default authAxiosInstance;