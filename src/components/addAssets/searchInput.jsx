/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect, useRef } from "react";
import eye from "../../assets/eye.svg";
import hideeye from "../../assets/hideeye.svg";
import { Field, useFormikContext } from "formik";
import Triangle from "../../assets/triangle.png";

const SearchInput = (props) => {
  const { values, setFieldValue } = useFormikContext();
  const [selectedItemId, setSelectedItemId] = useState();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isInputFocused, setInputFocused] = useState(false);

  const {
    labelText,
    data,
    searchText,
    setStockId,
    setStockName,
    stockName,
    idText,
    htmlForText,
    typeText,
    validation,
    name,
    errText,
    password,
    passValue,
    currEmailvalue,
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    if (searchText === "" && isInputFocused) {
      setDropdownOpen(true);
    }
  }, [searchText, isInputFocused]);

  useEffect(() => {
    // Set the initial value of the input field if available
    if (passValue) {
      setFieldValue(name, passValue);
      // setDropdownOpen(false);
    }
  }, [passValue, name, setFieldValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onClickvalue = (id, status) => {
    //  sendSelectedOpt(id)
    setSelectedItemId(id);
    setDropdownOpen(false);
    setStockId(id);
    setStockName(status);
    setFieldValue(name, status);
    // sendSelectedOpt(id)
  };

  const filteredData = data.filter((each) =>
    each?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  //  useEffect(()=>{
  //   setFilteredData(filteredData)
  //  },[filteredData])

  const labelClassName = `max-w-[360px] text-roboto  font-[400] leading-normal tracking-[0.15px] -mb-7  text-[12px]   ${
    validation ? "text-red-500" : "text-[#A8A8A8]"
  }`;

  const inputClassName = `w-[100%] h-[42px]  border-b-2 outline-none px-0 bg-transparent text-neutral-700 text-white placeholder-[16px] text-roboto tracking-tight-[0.15px]   ${
    validation ? "placeholder-red-500" : "placeholder-[#A8A8A8]"
  } ${validation ? "border-red-500" : "border-[#A8A8A8]"}`;

  return (
    <div  ref={containerRef} className={`flex flex-col h-[48px] relative`}>
      {!values[name] ? null : (
        <label
          htmlFor={htmlForText}
          className={labelClassName}
          style={{
            position: "absolute",
            top: "-10px",
            left: "0",
            transition: "top 0.2s ease-in-out",
          }}
        >
          {labelText ? labelText : "Email address"}
        </label>
      )}
      <Field name={name}>
  {({ field }) => (
    <input
      {...field}
      type={showPassword ? "text" : typeText}
      id={idText}
      className={inputClassName}
      style={{
        position: "relative",
        zIndex: "1",
        pointerEvents: currEmailvalue ? "none" : "auto",
        color: currEmailvalue ? "rgba(255, 255, 255, 0.4)" : "",
      }}
      placeholder={labelText}
      autoComplete="off"
      onFocus={() => {
        setInputFocused(true);
        setDropdownOpen(true);
      }}
      onBlur={() => setInputFocused(false)}
      onChange={(e) => {
        field.onChange(e);
        setDropdownOpen(true); // Reopen dropdown on typing
        setSelectedItemId(null); // Allow reselection
        setStockName(e.target.value); // Update stock name
        setStockId(null); 
      }}
    />
  )}
</Field>
<div
onClick={() => {
  setDropdownOpen(!isDropdownOpen)}}
        className=" h-[27px] rounded-[13.5px] flex items-center justify-center gap-4 absolute right-0 top-2 z-20"
      >   
        <img
          src={Triangle}
          alt="trinagle"
          className={`relative ${!isDropdownOpen ? "rotate-180" : "rotate-0"}`}
        />
      </div>
      {password &&
        passValue?.length > 0 &&
        (showPassword ? (
          <button
            className="absolute top-1 right-2 z-10 h-6 w-6"
            onClick={handleShowPassword}
            type="button"
          >
            <img src={hideeye} alt="" className="h-6 w-6" />
          </button>
        ) : (
          <button
            className="absolute top-1 right-2 z-10 h-6 w-6"
            onClick={handleShowPassword}
            type="button"
          >
            <img src={eye} alt="" className="h-6 w-6" />
          </button>
        ))}
      {validation && (
        <div className="flex flex-col items-center self-start absolute top-[45px]">
          <div
            className="w-0 h-0 
            border-l-[10px] border-l-transparent
            border-b-[10px] border-b-[#616161]
            border-r-[10px] border-r-transparent"
          ></div>
          <div className="text-[12px] font-medium text-roboto text-center text-white px-10 min-h-[22px] rounded-[4px] bg-[#616161] flex justify-center items-center">
            {errText}
          </div>
        </div>
      )}
      {isDropdownOpen && (
        <>
          {filteredData?.length > 0 ? (
            <div className="absolute top-[50px] rounded pt-0 bg-[#2E2E2E] w-[100%] h-auto  flex flex-col z-20 overflow-y-auto max-h-[120px] ff-scroll">
              {filteredData?.map((each) => (
                <p
                  key={each.id}
                  onClick={() => onClickvalue(each?.id, each?.name)}
                  className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto p-2  hover:bg-[#3E3E3E] cursor-pointer ${
                    selectedItemId === each?.id && "bg-[#3E3E3E]"
                  } `}
                >
                  {`${each?.ticker} - ${each?.name}`}
                </p>
              ))}
            </div>
          ) : (
            <div className="text-[#F6F8FB] absolute top-[50px] rounded pt-1 pl-3 bg-[#2E2E2E] w-[100%]  flex flex-col z-10 overflow-y-auto h-[40px] ff-scroll">
              No data found
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchInput;
