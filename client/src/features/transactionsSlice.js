import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from "../services/api";

// Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    const res = await getTransactions();
    return res.data;
  }
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.list = action.payload;
      state.status = "success";
    });
  },
});

export default transactionsSlice.reducer;
