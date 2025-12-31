const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <p className="text-gray-600">{text}</p>
    </div>
  );
};

export default Loader;
