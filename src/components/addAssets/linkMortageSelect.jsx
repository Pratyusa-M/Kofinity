/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Triangle from "../../assets/triangle.png";
import { useState, useRef, useEffect } from "react";

const LinkMortageSelect = ({
  data,
  placeholder,
  getSelectedOpt,
  setId,
  setText,
  loanName,
  loanName2,
  passValue,
  isEditRealEstate,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  // const [value, setvalue] = useState(data[0]?.name);
  const [value, setvalue] = useState();
  // const [selectedItemId, setSelectedItemId] = useState(data[0]?.id);
  const [selectedItemId, setSelectedItemId] = useState();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isEditRealEstate) {
      if (passValue) {
        setvalue(passValue);
        setText(passValue);
      } else if (passValue === undefined) {
        setvalue("No debt");
        setText("No debt");
      }
    }
  }, [passValue]);

  useEffect(() => {
    if (loanName) {
      setvalue(loanName);
      setText(loanName);
    } else if (loanName2) {
      setvalue(loanName2);
      setText(loanName2);
    }
  }, [loanName, loanName2]);

  const onClickDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const sendSelectedOpt = (id) => {
    getSelectedOpt(id);
  };

  const onClickvalue = (data) => {
    setDropdownOpen(false);
    sendSelectedOpt(data.id);
    if (data.name !== "Loan already created") {
      setvalue(data.name);
      setText(data.name);
    }
    // setvalue(data.name);
    setSelectedItemId(data.id);
    // setId(data.name);
    // setDropdownOpen(false);
    // sendSelectedOpt(data.id)
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
          <input
            type="text"
            value={value}
            className="w-[95%] mb-2 text-white bg-transparent outline-none"
            readOnly
          />
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
        <div className="absolute top-[40px] rounded pt-0 bg-[#2E2E2E] w-[100%] h-auto  flex flex-col z-10 overflow-y-auto">
          {data?.map((each) => (
            <p
              key={each.id}
              onClick={() => onClickvalue(each)}
              className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto p-2  hover:bg-[#3E3E3E] cursor-pointer ${
                selectedItemId === each?.id && "bg-[#3E3E3E]"
              } `}
            >
              {each?.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkMortageSelect;
