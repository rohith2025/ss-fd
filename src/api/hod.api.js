import api from "./axios";

export const getLinkedStudents = () =>
  api.get("/hod/students");

export const getStudentProfile = (studentId) =>
  api.get(`/hod/student/${studentId}`);



