import api from "./axios";

export const createTransaction = (data) =>
  api.post("/transactions", data);

export const getAllTransactions = () =>
  api.get("/transactions");
