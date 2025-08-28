/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Field, useFormikContext } from "formik";
import Triangle from "../../assets/triangle.png";

const AssetPriceInput = (props) => {
  const {
    labelText,
    idText,
    htmlForText,
    typeText,
    validation,
    name,
    errText,
    passValue,
    curData,
    selectedCurrency,
    settingCurrency,
    setFormValues,
    isSetFormValues,
    shouldPreventKeys,
  } = props;

  const { values, setFieldValue } = useFormikContext();
  const [isOpen, setOpen] = useState(false);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(21);
  const dropdownRef = useRef(null);
console.log("values", values);
  useEffect(() => {
    // Update local storage whenever values change
    if (isSetFormValues) {
      const formData = { ...values }; // Include all form values
      setFormValues(formData);
    }
    // localStorage.setItem("formData", JSON.stringify(formData));
  }, [values]);

  useEffect(() => {
    // Set the initial value of the input field if available
    if (passValue || passValue === 0) {
      setFieldValue(name, passValue);
    }
  }, [passValue, name, setFieldValue]);

  const labelClassName = `max-w-[360px] text-roboto  font-[400] leading-normal tracking-[0.15px] -mb-7  text-[12px]   ${
    validation ? "text-red-500" : "text-[#A8A8A8]"
  }`;

  const inputClassName = `w-[100%] h-[42px]  border-b-2 outline-none px-0 bg-transparent text-neutral-700 text-white placeholder-[16px]   ${
    validation ? "placeholder-red-500" : "placeholder-[#A8A8A8]"
  } ${validation ? "border-red-500" : "border-[#A8A8A8]"}`;

  const onOpenCurrencyDropDown = () => {
    setOpen(!isOpen);
  };

  const onSelectCurrency = (each) => {
    console.log("selected currency", each);
    settingCurrency(each);
    setSelectedCurrencyId(each.id);
    setOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // setDropdownOpen(false);
      setOpen(false);
      //  setProfileOpen(false)
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`flex flex-col h-[48px] relative`} ref={dropdownRef}>
      {values[name] || values[name] === 0 ? (
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
      ) : null}
      <Field
        type={typeText}
        name={name}
        id={idText}
        className={inputClassName}
        style={{
          position: "relative",
          zIndex: "1",
          //   pointerEvents: currEmailvalue ? "none" : "auto",
          //   color: currEmailvalue ? "rgba(255, 255, 255, 0.4)" : "",
        }}
        placeholder={labelText}
        onKeyDown={(evt) =>
          shouldPreventKeys &&
          ["e", "E", "+", "-"].includes(evt.key) &&
          evt.preventDefault()
        }
        autoComplete="off"
      />
      {validation && (
        <div className="flex flex-col items-center self-start absolute top-11">
          <div
            className="w-0 h-0 
            border-l-[10px] border-l-transparent
            border-b-[10px] border-b-[#616161]
            border-r-[10px] border-r-transparent"
          ></div>
          <div className="text-[12px] font-medium text-roboto text-center text-white px-10 min-h-[22px] rounded-[4px] bg-[#616161] flex justify-center items-center z-10">
            {errText}
          </div>
        </div>
      )}
      <div
        onClick={onOpenCurrencyDropDown}
        className="bg-[#2E2E2E] w-[81px] h-[27px] rounded-[13.5px] flex items-center justify-center gap-4 absolute right-0 top-2 z-10 cursor-pointer"
        
      >
        <span className="w-[30px] text-[#A8A8A8] text-[12px] font-[500] text-roboto">
          {selectedCurrency ? selectedCurrency : "USD"}
        </span>
        <img
          src={Triangle}
          alt="trinagle"
          className={`relative ${!isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </div>
      {isOpen && (
        <div className="w-[81px] bg-[#2E2E2E] absolute top-10 right-0 z-50">
          {curData?.map((each, idx) => (
            <p
              onClick={() => onSelectCurrency(each)}
              key={idx}
              className={`text-[#F6F8FB] text-[16px] text-center font-[400] text-roboto p-2  hover:bg-[#3E3E3E] cursor-pointer ${
                selectedCurrencyId === each?.id && ""
              }`}
            >
              {each.option}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetPriceInput;
