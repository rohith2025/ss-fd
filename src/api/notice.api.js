import api from "./axios";

export const createNotice = (data) =>
  api.post("/notices", data);

export const getNotices = () =>
  api.get("/notices");
