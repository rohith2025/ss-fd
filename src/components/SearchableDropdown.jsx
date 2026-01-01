import { useState, useEffect, useRef } from "react";

const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = "Search...",
  displayKey = "name",
  valueKey = "_id",
  className = "",
  required = false,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Find selected option
    const option = options.find((opt) => opt[valueKey] === value);
    if (option) {
      setSelectedOption(option);
      setSearchTerm(option[displayKey] || "");
    } else {
      setSelectedOption(null);
      if (!value) {
        setSearchTerm("");
      }
    }
  }, [value, options, displayKey, valueKey]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) => {
    const displayValue = option[displayKey]?.toLowerCase() || "";
    const email = option.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return displayValue.includes(search) || email.includes(search);
  });

  const handleSelect = (option) => {
    setSelectedOption(option);
    setSearchTerm(option[displayKey] || "");
    setShowDropdown(false);
    onChange(option[valueKey]);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleFocus = () => {
    setShowDropdown(true);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        required={required}
        disabled={disabled}
        className="w-full border rounded-md px-3 py-2 text-sm"
      />
      {showDropdown && searchTerm && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option[valueKey]}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 hover:bg-sky-50 cursor-pointer text-sm"
            >
              {option[displayKey]}
              {option.email && (
                <span className="text-gray-500 ml-2">({option.email})</span>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedOption && (
        <input type="hidden" value={value || ""} />
      )}
    </div>
  );
};

export default SearchableDropdown;

