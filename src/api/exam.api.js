import api from "./axios";

export const createExam = (data) =>
  api.post("/exams", data);

export const getMyExams = () =>
  api.get("/exams/my");
