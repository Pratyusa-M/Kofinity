/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import eye from "../../assets/eye.svg";
import hideeye from "../../assets/hideeye.svg";
import { Field, useFormikContext } from "formik";
import format from "date-fns/format";


const CurrentPriceDate = (props) => {
  const { values, setFieldValue } = useFormikContext();
  const {
    labelText,
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

//   useEffect(() => {
//     // Set the initial value of the input field if available
//     if (passValue) {
//       setFieldValue(name, passValue);
//     } else if (currEmailvalue) {
//       setFieldValue(name, currEmailvalue);
//     }
//   }, [passValue, name, setFieldValue, currEmailvalue]);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, "MM/dd/yyyy");
    // "h:mm a" for time in AM/PM format, "MM/dd/yyyy" for date
    setFieldValue(name, formattedDate);
    
  }, [passValue, name, setFieldValue, currEmailvalue]);
  

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const labelClassName = `max-w-[360px] text-roboto  font-[400] leading-normal tracking-[0.15px] -mb-7  text-[12px]   ${
    validation ? "text-red-500" : "text-[#A8A8A8]"
  }`;

  const inputClassName = `w-[100%] h-[42px]  border-b-2 outline-none px-0 bg-transparent text-neutral-700 text-white placeholder-[16px] text-roboto tracking-tight-[0.15px]   ${
        validation ? "placeholder-red-500" : "placeholder-[#A8A8A8]"
      } ${validation ? "border-red-500" : "border-[#A8A8A8]"}`;

  return (
    <div className={`flex flex-col h-[48px] relative`}>
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
      <Field
        type={showPassword ? "text" : typeText}
        name={name}
        id={idText}
        className={inputClassName}
        readOnly 
        style={{
          position: "relative",
          zIndex: "1",
          pointerEvents: currEmailvalue ? "none" : "auto",
          color: currEmailvalue ? "rgba(255, 255, 255, 0.4)" : "",
        }}
        placeholder={labelText}
        autoComplete="off"
      />
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
    </div>
  );
};

export default CurrentPriceDate;
