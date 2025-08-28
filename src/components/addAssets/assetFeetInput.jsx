/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Field, useFormikContext } from "formik";
import Triangle from "../../assets/triangle.png";
import { useEffect } from "react";


const AssetFeetInput = (props) => {
  const { values, setFieldValue } = useFormikContext();
  const {
    labelText,
    idText,
    htmlForText,
    typeText,
    validation,
    name,
    errText,
    passValue,
    setFormValues,
    isSetFormValues,
    shouldPreventKeys
  } = props;

  useEffect(() => {
    // Update local storage whenever values change
    if (isSetFormValues){
    const formData = { ...values }; // Include all form values
    setFormValues(formData)
    }
    // localStorage.setItem("formData", JSON.stringify(formData));
  }, [values]);

  useEffect(() => {
    // Set the initial value of the input field if available
    if (passValue) {
      setFieldValue(name, passValue);
    } 
  }, [passValue,name, setFieldValue]);


  const labelClassName = `max-w-[360px] text-roboto  font-[400] leading-normal tracking-[0.15px] -mb-7  text-[12px]   ${
    validation ? "text-red-500" : "text-[#A8A8A8]"
  }`;

  const inputClassName = `w-[100%] h-[42px]  border-b-2 outline-none px-0 bg-transparent text-neutral-700 text-white placeholder-[16px]   ${
        validation ? "placeholder-red-500" : "placeholder-[#A8A8A8]"
      } ${validation ? "border-red-500" : "border-[#A8A8A8]"}`;

  return (
    <div className={`flex flex-col h-[48px] relative`}>
      {(values[name] || values[name]===0) ?  (
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
      ):null}
      <Field
        type={ typeText}
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
          <div className="text-[12px] font-medium text-roboto text-center text-white px-10 min-h-[22px] rounded-[4px] bg-[#616161] flex justify-center items-center">
            {errText}
          </div>
        </div>
      )}
      <div className=" w-[81px] h-[27px] rounded-[13.5px] flex items-center justify-center gap-4 absolute -right-6 top-3">
        <p className="text-[#A8A8A8] text-[12px] font-[500] text-roboto">sq.ft</p> 
      </div>
    </div>
  );
};

export default AssetFeetInput;
