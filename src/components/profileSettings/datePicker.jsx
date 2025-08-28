/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// DatePicker.js

import { useEffect } from "react";
import { Field, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment/moment";


const DatePickerInput = (props) => {
  const { values, setFieldValue } = useFormikContext();
  const { name, passValue, label, errText, validation } = props;

  useEffect(() => {
    // Set the initial value of the input field if available
    if (passValue!==null || passValue!== undefined) {
      setFieldValue(name, passValue);
    }else{
      setFieldValue(name, "");
    }
  }, [passValue]);

  const labelClassName = `max-w-[360px]  font-normal leading-normal tracking-tight -mb-7  text-[12px]  text-roboto   ${validation ? "text-red-500" : "text-[#A8A8A8]"
    }`;

  const inputClassName = `w-[100%] h-[42px]  border-b-2 outline-none px-0 bg-transparent text-neutral-700 text-white  ${validation ? "placeholder-red-500" : ""
    } ${validation ? "border-red-500" : "border-zinc-400"}`

  // const handleChange = (date) => {
  //   const formattedDate = date
  //     ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
  //     : "";
  //   setFieldValue(name, formattedDate);
  // };

  return (
    <div className="flex flex-col relative">
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
            {...field}
            id={name}
            className={inputClassName}
            placeholderText={label}
            dateFormat="MM/dd/yyyy"
            selected={values[name]}
            onChange={(date) => setFieldValue(name, date)}
            maxDate={new Date()}
            showYearDropdown
             yearDropdownItemNumber={50}
             scrollableYearDropdown
             autoComplete="off"
          // onChange={handleChange}
          />
        )}
      />
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

export default DatePickerInput;
