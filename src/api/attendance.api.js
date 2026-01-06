import api from "./axios";

export const getMyAttendance = () =>
  api.get("/attendance/my");

// New timetable-driven attendance APIs
export const getTeacherClasses = (date) =>
  api.get(`/attendance/classes?date=${date}`);

export const getClassStudents = (params) =>
  api.get("/attendance/class-students", { params });

export const markBulkAttendance = (data) =>
  api.post("/attendance", data);
