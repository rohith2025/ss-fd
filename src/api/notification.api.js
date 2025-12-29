import api from "./axios";

export const createNotification = (data) =>
  api.post("/notifications", data);

export const getNotifications = () =>
  api.get("/notifications");
