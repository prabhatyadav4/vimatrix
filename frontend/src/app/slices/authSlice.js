import { createSlice } from "@reduxjs/toolkit";

// What does authSlice manage?
// Everything about the logged-in user:
//   - who they are (user object)
//   - their access token (for API calls)
//
// localStorage is used so data survives page refresh.
// Without it, every refresh would log the user out.

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Called after successful login or register
    login: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;

      // Persist to localStorage so refresh doesn't log user out
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("accessToken", action.payload.accessToken);
    },

    // Called on logout or when token refresh fails (401)
    logout: (state) => {
      state.user = null;
      state.accessToken = null;

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },

    // Called after updating profile (name, email, avatar etc.)
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

// Export the actions — these are what other files import
export const { login, logout, updateUser } = authSlice.actions;

// Export the reducer — this goes into store.js
export default authSlice.reducer;
