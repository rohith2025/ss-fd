import api from "./axios";

export const getMyFees = () =>
  api.get("/fees/my");

export const approveSemesterFee = (studentId, semester) =>
  api.put(`/fees/approve/${studentId}/${semester}`);

export const getStudentFees = (studentId) => {
   api.get(`/fees/${studentId}`);
};