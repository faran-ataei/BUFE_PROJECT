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
      if (result.message && !result.data) {
        return rejectWithValue(result.message || "Login failed");
      }
      return result.data; // فرض بر این است که اطلاعات کاربر در result.data است
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const resendVerify = createAsyncThunk(
  "user/resendVerify",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await postData(`${API_URL}/users/resend/verification`, userData);
      if (result.message && !result.data) {
        return rejectWithValue(result.message || "Something went wrong");
      }
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error resending verification");
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    const result = await deleteData(`${API_URL}/users/logout`);
    return result.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


const initialState = {
  user: null,
  lastLoginAt: null,
  isLoading: false,
  error: null,
  message: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearAllUserData: (state) => {
      state.user = null;
      state.lastLoginAt = null;
      state.error = null;
      state.message = null;
      state.isLoading = false;
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Register
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

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = {
        name: action.payload.user,
        lastName: action.payload.lastName,
        email: action.payload.email,
        admin: action.payload.admin || false,
      };
      // ذخیره زمان دقیق ورود به میلی‌ثانیه
      state.lastLoginAt = new Date().getTime();
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Login failed";
    });

    // Resend Verify
    builder.addCase(resendVerify.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resendVerify.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload?.message || "Verification email sent";
    });
    builder.addCase(resendVerify.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.lastLoginAt = null;
      state.error = null;
      state.message = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const { clearAllUserData, resetError } = userSlice.actions;
export default userSlice.reducer;