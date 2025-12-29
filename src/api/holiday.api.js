import api from "./axios";

export const createHoliday = (data) =>
  api.post("/holidays", data);

export const getHolidays = () =>
  api.get("/holidays");
