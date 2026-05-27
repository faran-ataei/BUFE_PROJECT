import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import expireTransform from "redux-persist-transform-expire"; // Yeni eklendi

import userReducer from "../slices/user.slice.js";
import productsReducer from "../slices/products.slice.js";
import cartReducer from "../slices/cart.slice.js";

// --- Persist Configs ---

const userPersistConfig = {
  key: "user",
  storage,
  // Sadece user ve lastLoginAt verilerini saklar
  whitelist: ["user", "lastLoginAt"], 
  transforms: [
    expireTransform({
      // 7 gün sonra veriyi temizlemek için kontrol edilecek anahtar
      expireKey: 'lastLoginAt', 
      // 7 günün milisaniye karşılığı: 7 * 24 * 60 * 60 * 1000
      defaultExpiration: 604800000, 
      // Süre dolduğunda veriyi otomatik olarak temizle
      autoExpire: true 
    })
  ]
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
        // Redux-persist eylemlerini kontrol dışı bırakır (Hata almamak için)
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