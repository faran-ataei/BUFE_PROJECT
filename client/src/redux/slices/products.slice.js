import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getData } from "@/utils/fetchAPI";

const API_URL = import.meta.env.VITE_API_URL;

// Sunucudan ürünleri çeken asenkron thunk fonksiyonu
export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const result = await getData(`${API_URL}/products`);
      return result;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  // 🌟 ONAYLANDI: Senkron veri güncellemeleri için reducers alanı dolduruldu
  reducers: {
    // Admin ürünü güncellediğinde Redux Store'daki ürünü anında değiştiren fonksiyon
    updateProductInStore: (state, action) => {
      const updatedProduct = action.payload;
      console.log("1. Redux'a Gelen Güncel Ürün:", updatedProduct);
      console.log(
        "2. Redux'taki Mevcut Ürünler:",
        JSON.parse(JSON.stringify(state.products)),
      );

      state.products = state.products.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product,
      );

      console.log(
        "3. Güncelleme Sonrası Ürünler:",
        JSON.parse(JSON.stringify(state.products)),
      );
    },
  },
  // Asenkron (API istekleri) durum yönetimleri
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🌟 ONAYLANDI: Bileşenlerde (Component) dispatch ile çağırabilmek için action fonksiyonunu dışa aktarıyoruz
export const { updateProductInStore } = productsSlice.actions;

export default productsSlice.reducer;
