import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteData, postData } from "@/utils/fetchAPI";

const API_URL = import.meta.env.VITE_API_URL;

// --- Thunks (Asenkron İşlemler) ---

// Şifre sıfırlama bağlantısı isteği (E-posta gönderimi)
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (emailData, { rejectWithValue }) => {
    try {
      const result = await postData(`${API_URL}/users/forgot-password`, emailData);
      return result.data?.message || "Sıfırlama bağlantısı gönderildi.";
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "E-posta gönderilemedi.");
    }
  }
);

// Yeni şifreyi belirleme ve kaydetme
export const resetPasswordAction = createAsyncThunk(
  "user/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      // Token URL'den, password ise formdan gelir
      const result = await postData(`${API_URL}/users/reset-password/${token}`, { password });
      return result.data?.message || "Şifreniz başarıyla güncellendi.";
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Şifre güncellenemedi.");
    }
  }
);

export const registerNewUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await postData(`${API_URL}/users/new/user`, userData);
      if (!result || !result.data) {
        return rejectWithValue(result?.message || "Kayıt başarısız");
      }
      return result.data.message;
    } catch (error) {
      return rejectWithValue(
        `Kayıt hatası: ${error.response?.data?.error || error.message}`
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
        return rejectWithValue(result.message || "Giriş başarısız");
      }
      return result.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Giriş başarısız");
    }
  }
);

export const resendVerify = createAsyncThunk(
  "user/resendVerify",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await postData(`${API_URL}/users/resend/verification`, userData);
      if (result.message && !result.data) {
        return rejectWithValue(result.message || "Bir şeyler yanlış gitti");
      }
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Doğrulama hatası");
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

// --- Slice Ayarları ---

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
      state.lastLoginAt = Date.now(); 
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Giriş başarısız";
    });

    // Forgot Password (Şifremi Unuttum)
    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Reset Password (Şifre Sıfırlama)
    builder.addCase(resetPasswordAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resetPasswordAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
      state.error = null;
    });
    builder.addCase(resetPasswordAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Resend Verify
    builder.addCase(resendVerify.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resendVerify.fulfilled, (state, action) => {
      state.isLoading = false;
      state.message = action.payload?.message || "Doğrulama e-postası gönderildi";
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