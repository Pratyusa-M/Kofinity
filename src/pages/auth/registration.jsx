/* eslint-disable no-unused-vars */
import { useState } from "react";
import AuthInput from "../../components/auth/authInput";
import AuthButton from "../../components/auth/authButton";
import AuthLayout from "../../components/layout/authLayout";
import GoogleButton from "../../components/auth/googleButton";
import FacebookButton from "../../components/auth/facebookButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { baseUrl } from "../../utils/baseUrl";
import LoadingButton from "../../components/auth/LoadingButton";

const Registration = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const registerValidationSchema = Yup.object({
    email: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}auth/signup/password`, {
        email: values.email,
        password: values.password,
        confirmPassword: values.password,
      });
      localStorage.setItem("email", values.email);
      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "OTP sent successfully to your mail";

      toast.success(successMessage, {});

      setTimeout(() => {
        navigate("/verification");
      }, 2000);
    } catch (error) {
      const errorMessage =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "Registration failed";
      toast.error(errorMessage, {});
      // alert(errorMessage);

      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignIn = () => {
    navigate("/signin");
  };

  const handleLoginSuccess = (message) => {
    toast.success(message, {});
  };

  const handleLoginFailure = (message) => {
    toast.error(message, {});
  };

  return (
    <AuthLayout
      jsxProp={
        <div className="w-[100%] flex flex-col ">
          <ToastContainer />
          <h1
            className={`text-2xl font-[700] text-roboto  leading-[30px] tracking-[0.9px]
              text-white
            `}
          >
            Registration
          </h1>
          <p
            className={`opacity-70 text-base font-normal leading-[30px] tracking-[0.5px] text-roboto cursor-pointer text-white`}
          >
            Already have account?{" "}
            <span
              onClick={navigateToSignIn}
              className="text-emerald-300 text-base font-normal  underline leading-[30px] tracking-tight text-roboto"
            >
              Sign In
            </span>
          </p>
          <div className="h-[380px]  mt-[25px] overflow-auto pr-4 ff-scroll overflow-x-hidden">
            <Formik
              initialValues={initialValues}
              validationSchema={registerValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className=" mb-2 mt-5">
                    <AuthInput
                      labelText="Email address"
                      idText={"email"}
                      name={"email"}
                      htmlForText={"email"}
                      typeText={"text"}
                      errText={"Email is required"}
                      validation={
                        errors?.email && touched?.email ? true : false
                      }
                      password={false}
                    />
                  </div>
                  <div className=" mb-0 -mt-7">
                    <AuthInput
                      labelText="Password"
                      idText={"password"}
                      name={"password"}
                      htmlForText={"password"}
                      typeText={"password"}
                      errText={errors?.password}
                      validation={
                        errors?.password && touched?.password ? true : false
                      }
                      password={true}
                      passValue={formValue?.password}
                    />
                  </div>
                  <AutoSubmitToken setFormValue={setFormValue} />
                  <div className="mb-3 -mt-3">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AuthButton
                        disabled={
                          errors?.email ||
                          errors?.password ||
                          formValue?.email?.length < 1 ||
                          formValue?.password?.length < 1
                        }
                      >
                        Continue
                      </AuthButton>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
            <div className="mt-[32px] mb-[36px] self-center -ml-10 sm:ml-3">
              <div className="w-[280px] sm:w-[332px] h-6 justify-center items-center gap-2.5 inline-flex">
                <div className="w-[80px] sm:w-[150px] h-px relative bg-[white] bg-opacity-40" />
                <div className="flex-col justify-center items-center inline-flex">
                  <div
                    className={`text-center text-roboto text-base font-normal leading-normal m-5 text-[#ffffff] text-opacity-70`}
                  >
                    Or
                  </div>
                </div>
                <div className="w-[65px] sm:w-[150px] h-px relative bg-[white] bg-opacity-40" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <GoogleButton
                onLoginSuccess={handleLoginSuccess}
                onLoginFailure={handleLoginFailure}
                v
              />
              {/* <FacebookButton
                onLoginSuccess={handleLoginSuccess}
                onLoginFailure={handleLoginFailure}
              /> */}
            </div>
          </div>
        </div>
      }
    />
  );
};
export default Registration;
