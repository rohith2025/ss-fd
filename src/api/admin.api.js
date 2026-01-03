import api from "./axios";

export const getAllUsers = () =>
  api.get("/admin/users");

export const linkUser = (data) =>
  api.put("/admin/link-user", data);

export const getUserLinks = (studentId) =>
  api.get(`/admin/user-links/${studentId}`);
