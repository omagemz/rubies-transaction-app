import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/transactions";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const getTransactions = () => axiosInstance.get("/");
export const addTransaction = (data) => axiosInstance.post("/", data);
export const updateTransaction = (id, data) => axiosInstance.put(`/${id}`, data);
export const deleteTransaction = (id) => axiosInstance.delete(`/${id}`);
