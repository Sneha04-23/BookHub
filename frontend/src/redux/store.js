import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import bookReducer from "./bookSlice";
import wishlistReducer from "./wishlistSlice"

export const store = configureStore({
    reducer :{
        auth: authReducer,
        books: bookReducer,
        wishlist: wishlistReducer,
    },
});
