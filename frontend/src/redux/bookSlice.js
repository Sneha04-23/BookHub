
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../services/api";

export const fetchBooks = createAsyncThunk(
    "book/fetchBooks",
    async() => {
        const res = await API.get("/books");
        return res.data;
    }
);

const bookSlice = createSlice({
    name: "books",

    initialState: {
        books: [],
        loading: false,
        error: null,
    },

    extraReducers: (builder) => {

        builder.addCase(fetchBooks.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchBooks.fulfilled, (state, action) => {
            state.loading = false;
            state.books = action.payload;
        });

        builder.addCase(fetchBooks.rejected, (state,action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default bookSlice.reducer;