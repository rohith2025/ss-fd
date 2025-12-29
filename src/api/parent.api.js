import api from "./axios";

export const getChildAttendance = (studentId) =>
  api.get(`/parent/attendance/${studentId}`);
