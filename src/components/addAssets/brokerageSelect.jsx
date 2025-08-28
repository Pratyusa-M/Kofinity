/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Triangle from "../../assets/triangle.png";
import { useState, useRef, useEffect } from "react";

const BrokerageSelect = ({ data, placeholder, getSelectedOpt, setId,passId,passOpt,dataLength }) => {
  console.log("data", data);
  console.log("dataLength", dataLength);
  console.log("passId", passId);
  console.log("passOpt", passOpt);
  
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [value, setvalue] = useState(data[0]?.bank_name?.name);
  const [selectedItemId, setSelectedItemId] = useState(data[0]?.id);
  const dropdownRef = useRef(null);

  const onClickDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const sendSelectedOpt = (optId) => {
    // getSelectedOpt(optId)
  }

  useEffect(()=>{
    if(passId && passOpt){
      setvalue(passOpt)
      setId(passId)
    }else{
    setvalue(data[dataLength-2]?.bank_name?.name)
    setId(data[dataLength-2]?.id)
    }
  },[data,passId,passOpt])

  useEffect(()=>{
    if (data?.length===0){
      setvalue('No bank account exists')
    }
  },[data])

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
    <div className={`relative h-[42px] mt-[8px]`} ref={dropdownRef}>
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
          className={`mb-2 transform ${!isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          src={Triangle}
          alt="triangle"
        />
      </div>
      {isDropdownOpen && (
        <div className="absolute top-[40px] rounded pt-0 bg-[#2E2E2E] w-[100%] h-auto  flex flex-col overflow-y-auto max-h-[120px] ff-scroll z-30">
          {data?.map((each,idx) => (
            <p
              key={idx}
              onClick={() => onClickvalue(each?.id, each?.bank_name.name)}
              className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto p-2  hover:bg-[#3E3E3E] cursor-pointer ${selectedItemId === each?.id && "bg-[#3E3E3E]"
                } `}
            >
              {each?.bank_name?.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrokerageSelect;
