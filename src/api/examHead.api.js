import api from "./axios";

export const getPendingActivities = () =>
  api.get("/exam-head/activities/pending");

export const approveActivity = (activityId, status) =>
  api.put(`/activities/${activityId}/approve`, { status });

export const getLinkedStudents = () =>
  api.get("/exam-head/students");

export const getStudentProfile = (studentId) =>
  api.get(`/exam-head/student/${studentId}`);

export const addOrUpdateGrades = (data) =>
  api.post("/grades", data);






