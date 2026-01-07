import AttendanceOverlay from "./AttendanceOverlay";

const ParentAttendanceOverlay = ({ open, onClose, attendance }) => {
  return (
    <AttendanceOverlay
      isOpen={open}
      onClose={onClose}
      attendance={attendance}
    />
  );
};

export default ParentAttendanceOverlay;
