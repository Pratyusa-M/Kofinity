/* eslint-disable react/prop-types */

import { useState,useEffect } from "react";
import eye from "../../assets/eye.svg";
import hideeye from "../../assets/hideeye.svg";
import { Field, useFormikContext } from "formik";

const AuthInput = (props) => {
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
    profileSettings,
    userDetails,
    currEmailvalue,
    shouldPreventKeys
    
  } = props;

  const [showPassword, setShowPassword] = useState(false);
 
  useEffect(() => {
    // Set the initial value of the input field if available
    if (passValue) {
      setFieldValue(name, passValue);
    }
    else if (currEmailvalue){
      setFieldValue(name, currEmailvalue)
    }
  }, [passValue, name, setFieldValue,currEmailvalue]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const labelClassName = `max-w-[360px]  font-normal leading-normal tracking-tight -mb-7  text-[16px]   ${
    validation ? "text-red-500" : "text-white"
  }`;

  const inputClassName = !userDetails
    ? `${
        profileSettings ? "w-[100%]" : " max-w-[370px]"
      } h-[42px]  border-b-2 outline-none px-0 bg-transparent text-neutral-700 text-white  ${
        validation ? "placeholder-red-500" : ""
      } ${validation ? "border-red-500" : "border-zinc-400"}`
    : `w-[100%] h-[42px]  border-b-2 outline-none px-0 bg-transparent text-neutral-700 text-white  ${
        validation ? "placeholder-red-500" : ""
      } ${validation ? "border-red-500" : "border-zinc-400"}`;


  return (
    <div className={`flex flex-col h-[100px] relative`}>
      {!values[name] ? null : (
        <label
          htmlFor={htmlForText}
          className={labelClassName}
          style={{
            position: "absolute",
            top: "-20px",
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
        style={{ position: "relative", zIndex: "1",pointerEvents: currEmailvalue ? "none" : "auto", color: currEmailvalue ? "rgba(255, 255, 255, 0.4)" : "", }}
        placeholder={labelText}
        autoComplete="off"
        // onKeyDown={(evt) => ["e", "E", "+", "-","."].includes(evt.key) && evt.preventDefault()}
        onKeyDown={(evt) =>
          shouldPreventKeys &&
          ["e", "E", "+", "-", "."].includes(evt.key) &&
          evt.preventDefault()
        }
        
      />
      {password &&
        passValue?.length > 0 &&
        (showPassword ? (
          <button
            className="absolute top-1 right-2 z-10 h-6 w-6"
            onClick={handleShowPassword}
            type="button"
          >
            <img src={eye} alt="" className="h-6 w-6" />
          </button>
        ) : (
          <button
            className="absolute top-1 right-2 z-10 h-6 w-6"
            onClick={handleShowPassword}
            type="button"
          >
            <img src={hideeye} alt="" className="h-6 w-6" />
          </button>
        ))}
      {validation && (
        <div className="flex flex-col items-center self-start">
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

export default AuthInput;
