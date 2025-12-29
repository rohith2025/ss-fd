import api from "./axios";

export const createTimetable = (data) =>
  api.post("/timetable", data);

export const getMyTimetable = () =>
  api.get("/timetable/my");
