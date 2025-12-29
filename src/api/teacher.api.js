import api from "./axios";

export const getTeacherDashboard = () =>
  api.get("/teacher/dashboard");

export const markAttendance = (data) =>
  api.post("/teacher/attendance", data);
