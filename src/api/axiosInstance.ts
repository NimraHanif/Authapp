// axios: the library we use to make HTTP requests
// (sending data to / getting data from a server over the internet).
import axios from 'axios';

// This creates a PRE-CONFIGURED version of axios, customized
// specifically for our app's needs — instead of using plain axios
// everywhere and repeating the same settings again and again.
const axiosInstance = axios.create({
  // Every request made with this instance will automatically start
  // with this address. So instead of writing the full URL every time,
  // we can just write axiosInstance.post('/auth/login') and axios
  // will build the full URL: https://dummyjson.com/auth/login
  baseURL: 'https://dummyjson.com',

  // If the server takes longer than 10,000 milliseconds (10 seconds)
  // to respond, axios will automatically give up and throw an error,
  // instead of leaving the app waiting forever.
  timeout: 10000,

  // "Headers" are extra info sent along with every request —
  // like a note attached to an envelope, separate from the actual data.
  // This tells the server: "the data I'm sending you is in JSON format."
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export this configured instance so other files (like LoginScreen.tsx)
// can import and use it to make requests.
export default axiosInstance;