import api from "./axios";

export const getStudentGrades = () =>
  api.get("/grades/my");

export const getChildGrades = (studentId) =>
  api.get(`/grades/child/${studentId}`);






