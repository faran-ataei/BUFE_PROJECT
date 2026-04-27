import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteData, postData } from "@/utils/fetchAPI";

const API_URL = import.meta.env.VITE_API_URL;

export const registerNewUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await postData(`${API_URL}/users/new/user`, userData);
      if (!result || !result.data) {
        return rejectWithValue(result?.message || "Registration failed");
      }
      console.log(result);
      return result.data.message;
    } catch (error) {
      return rejectWithValue(
        `Error registering user: ${error.response?.data?.error || error.message}`
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await postData(`${API_URL}/users/login`, userData);
      if (result.message) {
        return rejectWithValue(result || "Login failed");
      }
      console.log(result);
      return result.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resendVerify = createAsyncThunk(
  "user/resendVerify",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await postData(`${API_URL}/users/resend/verification`, userData);

      if (result.message) {
        return rejectWithValue(result || "Something went wrong");
      }
      console.log(result);
      return result.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  try {
    const result = await deleteData(`${API_URL}/users/logout`);
    localStorage.removeItem("user");
    return result.data;
  } catch (error) {
    console.error("Error logging out:", error);
  }
});

const initialValue = {
  user: (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  isLoading: false,
  error: null,
  message: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialValue,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerNewUser.pending, (state) => {
      state.isLoading = true;
      state.message = null;
    });
    builder.addCase(registerNewUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    });
    builder.addCase(registerNewUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = {
        username:action.payload.user,
      userEmail: action.payload.email,};
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Login failed";
    });
    builder.addCase(resendVerify.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resendVerify.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action.payload);
      state.message = action.payload.message;
    });
    builder.addCase(resendVerify.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export default userSlice.reducer;
