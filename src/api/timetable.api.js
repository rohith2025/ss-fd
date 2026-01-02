import api from "./axios";

export const createTimetable = (data) =>
  api.post("/timetable", data);

export const getMyTimetable = () =>
  api.get("/timetable/my");

export const getTeacherTimetable = () =>
  api.get("/timetable/teacher");

export const getTeachersByBranch = () =>
  api.get("/timetable/teachers");
