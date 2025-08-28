/* eslint-disable react/prop-types */
import React from "react";
import { useFormikContext } from "formik";

const AutoSubmitToken = ({ setFormValue }) => {
  const { values, submitForm } = useFormikContext();
  React.useEffect(() => {
    setFormValue(values);
  }, [values, submitForm, setFormValue]);
  return null;
};

export default AutoSubmitToken;
