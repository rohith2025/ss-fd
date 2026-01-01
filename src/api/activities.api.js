import api from "./axios";

export const addActivity = (data) =>
  api.post("/activities", data);

export const getActivities = (studentId) =>
  api.get(`/activities?studentId=${studentId}`);

export const approveActivity = (activityId, status) =>
  api.put(`/activities/${activityId}/approve`, { status });
