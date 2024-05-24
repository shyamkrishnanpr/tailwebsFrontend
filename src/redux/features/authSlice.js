import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "../../api/axios";

const initialState = {
  token: localStorage.getItem("teacherToken") || null,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/login", { username, password });
      const expirationTimeInMinutes = 60;
      const expirationTime =
        new Date().getTime() + expirationTimeInMinutes * 60 * 1000;

      localStorage.setItem(
        "teacherToken",
        JSON.stringify({
          token: response.data.token,
          expiresAt: expirationTime,
        })
      );

      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logout = () => (dispatch) => {
  localStorage.removeItem("teacherToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch(authSlice.actions.logout());
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload;
    });
  },
});

export const selectToken = (state) => state.auth.token;
export const selectError = (state) => state.auth.error;

export const { logout: logoutReducer } = authSlice.actions;

export default authSlice.reducer;
