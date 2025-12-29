import api from "./axios";

export const uploadThesis = (data) =>
  api.post("/thesis", data);

export const getStudentThesis = (studentId) =>
  api.get(`/thesis/student/${studentId}`);
