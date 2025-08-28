import AuthInput from "../../components/auth/authInput";
import AuthButton from "../../components/auth/authButton";
import AuthLayout from "../../components/layout/authLayout";
import { useNavigate } from "react-router-dom";

import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { baseUrl } from "../../utils/baseUrl";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from "../../components/auth/LoadingButton";

const PasswordReset = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);

  // schema
  const initialValues = {
    email: "",
  };

  const registerValidationSchema = Yup.object({
    email: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required"),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}auth/forgot/password?email=${formValue?.email}`,
        {
          email: values?.email,
        }
      );

      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "email sent successfully";
      toast.success(successMessage);
      navigate("/emailsent");
    } catch (error) {
      error.message = "Unregistered email";
      const errorMessage =
        typeof error?.message === "string"
          ? error?.message
          : "Error occuring on sending Email";
      error.message = "Unregistered email";
      toast.error(errorMessage);
      console.error("reset failed:", error, "error message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      jsxProp={
        <div className="w-[100%] flex flex-col ">
          <ToastContainer />
          <h1
            className={`text-2xl font-semibold text-roboto mt-5  leading-[30px] tracking-[0.9px]
              text-white`}
          >
            Password Reset
          </h1>
          <p
            className={` text-base font-normal leading-[30px] tracking-[0.5px] text-roboto mt-1 text-white text-opacity-70`}
          >
            Please enter your registered email.
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={registerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="relative mt-[45px] mb-2">
                  <AuthInput
                    labelText="Email address"
                    idText={"email"}
                    name={"email"}
                    htmlForText={"email"}
                    typeText={"text"}
                    placeHolderText={"Enter email"}
                    errText={"Email is required"}
                    validation={errors?.email && touched?.email ? true : false}
                  />
                </div>
                <div className="mb-3 -mt-3">
                  {loading ? (
                    <LoadingButton />
                  ) : (
                    <AuthButton
                      onClick={handleSubmit}
                      disabled={formValue?.email === "" || errors?.email}
                    >
                      Continue
                    </AuthButton>
                  )}
                </div>
                <AutoSubmitToken setFormValue={setFormValue} />
              </Form>
            )}
          </Formik>
        </div>
      }
    />
  );
};
export default PasswordReset;
