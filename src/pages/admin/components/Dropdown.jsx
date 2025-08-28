import { useState, useRef, useEffect } from 'react';

export const CustomDropdownNations = ({ options, selected, setSelected }) => {
    console.log("options", options)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
  if (option?.name === "All Nations"){
    setSelected(null)
    setIsOpen(false)
    return
  }
    setSelected(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full md:w-56">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg p-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {selected?.name || 'All Nations'}
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute w-full bg-slate-800 border border-slate-700 mt-1 rounded-lg z-10 max-h-60 overflow-auto">
          
          {options?.map((option) => (
              <li
                key={option?.id }
                onClick={() => handleSelect(option)}
                className="p-2 text-white hover:bg-purple-600 cursor-pointer"
              >
                {option?.name}
              </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export const CustomDropdownVerification = ({ options, selected, setSelected }) => {
    console.log("options", options)
    console.log("selected", selected)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full md:w-56">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg p-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {selected?.label}
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute w-full bg-slate-800 border border-slate-700 mt-1 rounded-lg z-10 max-h-60 overflow-auto">
          {options.map((option, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(option)}
              className="p-2 text-white hover:bg-purple-600 cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

