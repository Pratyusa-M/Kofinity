/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// DatePicker.js

import { useEffect } from "react";
import { Field, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment/moment";

const AssetDatePickerInput = (props) => {
  const { values, setFieldValue } = useFormikContext();

  const {
    name,
    passValue,
    label,
    errText,
    validation,
    isShowFutureDates,
    shouldPreventKeys,
    isReadOnly,
    setFormValues,
    isSetFormValues,
    setIsStDateFocused
  } = props;

  useEffect(() => {
    // Update local storage whenever values change
    if (isSetFormValues) {
      const formData = { ...values }; // Include all form values
      // console.log(formData, "local form dataaa vvv");
      setFormValues(formData);
    }
    // localStorage.setItem("formData", JSON.stringify(formData));
  }, [values]);

  useEffect(() => {
    // Set the initial value of the input field if available
    if (passValue) {
      setFieldValue(name, passValue);
    }
  }, [passValue, name, setFieldValue]);

  const labelClassName = `max-w-[360px]  font-normal leading-normal tracking-tight -mb-7  text-[12px]  text-roboto   ${
    validation ? "text-red-500" : "text-[#A8A8A8]"
  }`;

  const inputClassName = `w-[100%] h-[42px]  border-b-2 outline-none px-0 bg-transparent text-neutral-700 text-white  ${
    validation ? "placeholder-red-500" : "placeholder-[#A8A8A8]"
  } ${validation ? "border-red-500" : "border-[#A8A8A8]"}`;

  return (
    <div className="flex flex-col  relative">
      {!values[name] ? null : (
        <label
          htmlFor={name}
          className={labelClassName}
          style={{
            position: "absolute",
            top: "-10px",
            left: "0",
            transition: "top 0.2s ease-in-out",
          }}
        >
          {label}
        </label>
      )}
      <Field
        name={name}
        render={({ field }) => (
          <DatePicker
          withPortal={false}
            {...field}
            id={name}
            className={inputClassName}
            readOnly={isReadOnly}
            placeholderText={label}
            dateFormat="MM/dd/yyyy"
            selected={values[name]}
            onChange={(date) => setFieldValue(name, date)}
            // maxDate={new Date()}
            {...(!isShowFutureDates && { maxDate: new Date() })}
            showYearDropdown
            yearDropdownItemNumber={100}
            scrollableYearDropdown
            // onChange={handleChange}
            autoComplete="off"
            onFocus={() => setIsStDateFocused && setIsStDateFocused(true)}
            onBlur={() => setIsStDateFocused && setIsStDateFocused(false)}
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          popperClassName="z-[9999]"
  popperPlacement="bottom-start"
  popperModifiers={[
    {
      name: "offset",
      options: {
        offset: [0, 100],
      },
    },
    {
      name: "preventOverflow",
      options: {
        boundary: "viewport",
        tether: "false",
      },
    },
  ]}
          />
        )}
      />
      {validation && (
        <div className="flex flex-col items-center self-start z-0">
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
    </div>
  );
};

export default AssetDatePickerInput;
