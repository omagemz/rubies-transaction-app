import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./features/transactionsSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
  },
});
