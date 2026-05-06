import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "../slices/user.slice.js";
import productsReducer from "../slices/products.slice.js";
import cartReducer from "../slices/cart.slice.js";


const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "lastLoginAt"], 
};

const productsPersistConfig = {
  key: "products",
  storage,
};

const cartPersistConfig = {
  key: "cart",
  storage,
};

// --- Creating Persisted Reducers ---

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedProductsReducer = persistReducer(productsPersistConfig, productsReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

// --- Store Configuration ---

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    products: persistedProductsReducer,
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;