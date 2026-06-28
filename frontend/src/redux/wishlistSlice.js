
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";


// ---------------- GET WISHLIST ----------------

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetchWishlist",
    async () => {

        const res = await API.get("/users/wishlist");

        return res.data;
    }
);


// ---------------- ADD TO WISHLIST ----------------

export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (bookId, thunkAPI) => {

        await API.post(`/users/wishlist/${bookId}`);

        thunkAPI.dispatch(fetchWishlist())

        return bookId;
    }
);


// ---------------- REMOVE FROM WISHLIST ----------------

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeWishlist",
    async (bookId, thunkAPI) => {

        await API.delete(`/users/wishlist/${bookId}`);

        thunkAPI.dispatch(fetchWishlist())

        return bookId;
    }
);


const wishlistSlice = createSlice({

    name: "wishlist",

    initialState: {
        wishlist: [],
        loading: false,
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            // FETCH
            .addCase(fetchWishlist.fulfilled, (state, action) => {

                state.wishlist = action.payload;

            })

            // ADD
            .addCase(addToWishlist.fulfilled, (state, action) => {

                // state.wishlist.push({
                //     _id:action.payload
                // });

            })

            // REMOVE
            .addCase(removeFromWishlist.fulfilled, (state, action) => {

                // state.wishlist = state.wishlist.filter(
                //     (book) => book._id !== action.payload
                // );

            });

    }

});

export default wishlistSlice.reducer;