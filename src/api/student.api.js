import api from "./axios";

export const getStudentDashboard = () =>
  api.get("/student/dashboard");
