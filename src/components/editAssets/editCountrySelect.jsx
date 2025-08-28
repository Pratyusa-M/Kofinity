/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Triangle from "../../assets/triangle.png";
import { useState, useRef, useEffect } from "react";

const EditCountrySelect = ({ data, placeholder, getSelectedOpt, setId }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [value, setvalue] = useState(data[0]?.option);
  const [selectedItemId, setSelectedItemId] = useState(data[0]?.id);
  const dropdownRef = useRef(null);

  const onClickDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(()=>{
    setvalue(data[0]?.option)
  },[data])

  const sendSelectedOpt = (optId) => {
    // getSelectedOpt(optId)
  }

  const onClickvalue = (id, status) => {
    //  sendSelectedOpt(id)
    setvalue(status);
    setSelectedItemId(id);
    setId(id);
    setDropdownOpen(false);
    sendSelectedOpt(id)
  };

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
      {isDropdownOpen && (
        <div className="absolute top-[40px] rounded pt-0 bg-[#2E2E2E] w-[100%] h-auto  flex flex-col z-10 overflow-y-auto max-h-[120px] ff-scroll">
          {data?.map((each) => (
            <p
              key={each.id}
              onClick={() => onClickvalue(each?.id, each?.option)}
              className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto p-2  hover:bg-[#3E3E3E] cursor-pointer ${selectedItemId === each?.id && "bg-[#3E3E3E]"
                } `}
            >
              {each?.option}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditCountrySelect;
