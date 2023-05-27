import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import authReducer from './features/auth/authSlice';
import userReducer from './features/user/userSlice';
import productsReducer from './features/products/productsSlice';
import externalReducer from './features/external/externalSlice';
import { authApi } from './features/auth/authApi';
import { userApi } from './features/user/userApi';
import { productsApi } from './features/products/productsApi';
import { externalApi } from './features/external/externalApi';

const rootReducer = combineReducers({
  userAuth: authReducer,
  userStore: userReducer,
  products: productsReducer,
  external: externalReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [productsApi.reducerPath]: productsApi.reducer,
  [externalApi.reducerPath]: externalApi.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['userAuth', 'products', 'userStore'],
  blacklist: [
    [authApi.reducerPath],
    [userApi.reducerPath],
    [productsApi.reducerPath],
    [externalApi.reducerPath],
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      userApi.middleware,
      productsApi.middleware,
      externalApi.middleware
    ),
});

setupListeners(store.dispatch);
