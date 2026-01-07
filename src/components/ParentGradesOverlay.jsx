import CgpaOverlay from "./CgpaOverlay";

const ParentGradesOverlay = ({ open, onClose, grades }) => {
  return (
    <CgpaOverlay
      isOpen={open}
      onClose={onClose}
      grades={grades}
    />
  );
};

export default ParentGradesOverlay;
