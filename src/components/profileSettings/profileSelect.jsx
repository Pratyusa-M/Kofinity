/* eslint-disable react/prop-types */
import Triangle from "../../assets/triangle.png";
import { useState, useRef, useEffect } from "react";

const ProfileSelect = ({ passValue, martialData, getMartialId }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [value, setvalue] = useState();
  const [selectedItemId, setSelectedItemId] = useState();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setvalue(passValue?.status);
    setSelectedItemId(passValue?.id);
  }, [passValue]);

  const onClickDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const onClickvalue = (id, status) => {
    setvalue(status);
    setSelectedItemId(id);
    getMartialId(id);
    setDropdownOpen(false);
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
    <div className="relative" ref={dropdownRef}>
      {value && (
        <div className="text-[#A8A8A8] text-[12px] text-roboto font-[400] tracking-[0.15px]">
          Martial Status
        </div>
      )}
      <div
        onClick={onClickDropdown}
        className=" border-b-2 border-[#A8A8A8] flex justify-between items-center"
      >
        {!value ? (
          <p className="text-[16px] font-[400] text-[#A8A8A8] mb-2 ">
            Martial Status
          </p>
        ) : (
          <p className="mb-2 text-white">{value}</p>
        )}{" "}
        <img
          className={`mb-2 transform ${
            !isDropdownOpen ? "rotate-180" : "rotate-0"
          }`}
          src={Triangle}
          alt="triangle"
        />
      </div>
      {isDropdownOpen && (
        <div className="absolute top-[40px] rounded pt-0 bg-[#2E2E2E] w-[100%] h-[130px]  flex flex-col  overflow-y-auto ">
          {martialData?.map((each) => (
            <p
              key={each.id}
              onClick={() => onClickvalue(each.id, each.status)}
              className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto p-2  hover:bg-[#3E3E3E] ${
                selectedItemId === each.id && "bg-[#3E3E3E]"
              } `}
            >
              {each.status}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSelect;
