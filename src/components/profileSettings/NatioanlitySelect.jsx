/* eslint-disable react/prop-types */
import Triangle from "../../assets/triangle.png";
import { useState, useRef, useEffect } from "react";
import { GrClear } from "react-icons/gr";

const NationalitySelect = ({ passValue, NationalityData, getNatioanlityId }) => {
console.log("nationalityData", NationalityData);
console.log("passValue", passValue);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [value, setvalue] = useState();
  const [selectedItemId, setSelectedItemId] = useState();
  const dropdownRef = useRef(null);
   const [searchTerm, setSearchTerm] = useState("");

const filteredNationalities = NationalityData?.filter((item) =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  useEffect(() => {
    setvalue(passValue?.name);
    setSelectedItemId(passValue?.id);
  }, [passValue]);

  const onClickDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const onClickvalue = (id, status) => {
    setvalue(status);
    setSelectedItemId(id);
    getNatioanlityId(id);
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
          Nationality
        </div>
      )}
      <div
        onClick={onClickDropdown}
        className=" border-b-2 mb-5 border-[#A8A8A8] flex justify-between items-center"
      >
        {!value ? (
          <p className="text-[16px] font-[400] text-[#A8A8A8] mb-2 ">
            Nationality
          </p>
        ) : (
            <div className="flex w-full justify-between mr-3 items-center gap-2 mb-2">
          <p className=" text-white">{value}</p>
          
        </div>
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
<div
    className="absolute z-20 bottom-[40px] rounded bg-[#2E2E2E] w-full max-h-[200px] flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-[#555] scrollbar-track-transparent"
    style={{ paddingRight: '0.5rem', boxSizing: 'content-box' }}
  >
    {/* Search Input */}
    <div className="sticky top-0 bg-[#2E2E2E] p-2 z-10">
      <input
        type="text"
        placeholder="Search nationality..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-2 py-1 rounded bg-[#1F1F1F] text-white placeholder-gray-400 text-sm focus:outline-none"
      />
    </div>

    {/* Dropdown Items */}
    <div className="divide-y divide-[#3E3E3E]">
      {filteredNationalities.length > 0 ? (
        filteredNationalities.map((each) => (
          <p
            key={each.id}
            onClick={() => onClickvalue(each.id, each.name)}
            className={`text-[#F6F8FB] text-[14px] font-[400] px-3 py-2 hover:bg-[#3E3E3E] cursor-pointer ${
              selectedItemId === each.id && "bg-[#3E3E3E]"
            }`}
          >
            {each.name}
          </p>
        ))
      ) : (
        <p className="text-[#A8A8A8] text-sm px-3 py-2">No results found</p>
      )}
    </div>
  </div>
)}
    </div>
  );
}

export default NationalitySelect;
