import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/user.slice.js";
import productsSlice from "../slices/products.slice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    products: productsSlice,
  },
});

export default store;
