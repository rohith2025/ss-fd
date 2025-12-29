import api from "./axios";

export const applyLeave = (data) =>
  api.post("/leaves/apply", data);

export const getMyLeaves = () =>
  api.get("/leaves/my");

export const parentAction = (leaveId, data) =>
  api.put(`/leaves/parent/${leaveId}`, data);

export const hodAction = (leaveId, data) =>
  api.put(`/leaves/hod/${leaveId}`, data);
