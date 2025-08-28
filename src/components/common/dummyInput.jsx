/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Triangle from "../../assets/triangle.png";
import { useState, useRef, useEffect } from "react";

const DummySelect = ({  placeholder }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [value, setvalue] = useState();
  const [selectedItemId, setSelectedItemId] = useState();
  const dropdownRef = useRef(null);

  const onClickDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const sendSelectedOpt = (optId) => {
    // getSelectedOpt(optId)
  }


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative h-[48px]`} ref={dropdownRef}>
      {value && (
        <div className="text-[#A8A8A8] text-[12px] text-roboto font-[400] tracking-[0.15px] absolute -top-4">
          {placeholder}
        </div>
      )}
      <div
        onClick={onClickDropdown}
        className=" border-b-2 border-[#A8A8A8] flex justify-between items-center"
      >
        {!value ? (
          <p className="text-[16px] font-[400] text-[#A8A8A8] mb-2 ">
            {placeholder}
          </p>
        ) : (
          <p className="mb-2 text-white">{value}</p>
        )}{" "}
        <img
          className={`mb-2 transform ${!isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          src={Triangle}
          alt="triangle"
        />
      </div>
    </div>
  );
};

export default DummySelect;
