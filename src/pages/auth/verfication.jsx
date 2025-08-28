import { useState, useEffect } from "react";
import AuthInput from "../../components/auth/authInput";
import AuthButton from "../../components/auth/authButton";
import AuthLayout from "../../components/layout/authLayout";
import { useNavigate } from "react-router-dom";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from "../../components/auth/LoadingButton";

const Verification = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(59);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const localemail = localStorage.getItem("email");
  const initialValues = {
    otp: "",
  };

  const registerValidationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, "OTP must be a 6-digit number")
      .required("OTP is required"),
  });

  const handleSubmit = async (values) => {
    console.log(values, "valuesotp");
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}auth/verify/otp`, {
        email: localemail,
        otp: formValue?.otp.toString(),
      });

      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "Registered Successfully";

      toast.success(successMessage, {});
      setTimeout(() => {
        navigate("/success");
      }, 2000);
    } catch (error) {
      const errorMessage =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "Error occuring on OTP verification";
      toast.error(errorMessage, {});
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      setIsResendDisabled(true);
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleResendClick = async () => {
    setTimer(59);
    try {
      const response = await axios.post(`${baseUrl}auth/resend/signupotp`, {
        email: localemail,
      });

      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "OTP Sent";
      toast.success(successMessage);
    } catch (error) {
      const errorMessage =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "Please try again..!";
      toast.error(errorMessage);
      console.error("Login failed:", error);
    }
  };

  return (
    <AuthLayout
      jsxProp={
        <div className="w-[100%] flex flex-col p-3 -ml-5">
          <ToastContainer />
          <h1
            className={`text-2xl font-bold text-roboto  leading-[30px] tracking-[0.5px] mb-3
              text-white
            `}
          >
            Verification
          </h1>
          <p
            className={`w-[95%] opacity-70 text-base font-normal leading-[30px] tracking-[0.2px] text-roboto mb-5
              text-white
            `}
          >
            We will be sending a 6-digit one-time password (OTP) to your email.
            Please enter to verify.
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={registerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className=" mt-[25px] mb-0 flex flex-col">
                  <AuthInput
                    labelText="Email OTP"
                    idText={"emailotp"}
                    name={"otp"}
                    htmlForText={"emailotp"}
                    typeText={"number"}
                    placeHolderText={""}
                    errText={errors?.otp}
                    validation={errors?.otp && touched?.otp ? true : false}
                    shouldPreventKeys={true}
                  />
                  <p
                    className={`self-end  text-base font-normal text-roboto -mt-12 leading-normal tracking-tight
                      text-white text-opacity-70
                    `}
                  >
                    Time: 00:{String(timer).padStart(2, "0")}
                  </p>
                </div>
                <div className="mb-3 mt-10">
                  {loading ? (
                    <LoadingButton />
                  ) : (
                    <AuthButton
                      disabled={formValue?.otp === "" || errors?.otp}
                      onClick={handleSubmit}
                    >
                      Continue
                    </AuthButton>
                  )}
                </div>
                <AutoSubmitToken setFormValue={setFormValue} />
              </Form>
            )}
          </Formik>
          <p
            className={`text-center text-base font-normal text-roboto leading-normal tracking-tight mt-5
              text-white text-opacity-70
            `}
          >
            {`Didn't receive the OTP? `}
            <span
              onClick={isResendDisabled ? null : handleResendClick}
              className={` text-base font-normal text-roboto underline leading-normal cursor-pointer tracking-[0.2px] ${
                isResendDisabled
                  ? "pointer-events-none text-white text-opacity-70"
                  : "text-[#9768F0]"
              }`}
            >
              Resend
            </span>
          </p>
        </div>
      }
    />
  );
};

export default Verification;
