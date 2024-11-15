import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import productsReducers from './slices/productsSlice'
import productReducers from './slices/productSlice'
import favortiesReducer from './slices/favoritesSlice'

const reducer = combineReducers({
  productsState:productsReducers,
  productState:productReducers,
  favoritesSate:favortiesReducer
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;