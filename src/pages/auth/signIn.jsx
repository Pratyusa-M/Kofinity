/* eslint-disable no-unused-vars */
import AuthInput from "../../components/auth/authInput";
import AuthButton from "../../components/auth/authButton";
import AuthLayout from "../../components/layout/authLayout";
import GoogleButton from "../../components/auth/googleButton";
import FacebookButton from "../../components/auth/facebookButton";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from "../../components/auth/LoadingButton";

const SignIn = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const registerValidationSchema = Yup.object({
    email: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}auth/login/password`, {
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("token", response?.data?.data?.token);
      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "Successfully Logged in";
      toast.success(successMessage, {});
      setSubmitted(true);
      response?.data?.data?.showOnboarding ? (
        setTimeout(() => {
          navigate("/onboarding");
        }, 2000)
      ) : (
        setTimeout(() => {
          navigate("/allassets");
        }, 2000)
      )
    } catch (error) {
      setSubmitted(false);
      const errorMessage =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "Login failed";
      toast.error(errorMessage, {});
      // alert(errorMessage);
      console.error("Login failed:", error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigate("/registration");
  };

  const navigatePasswordReset = () => {
    navigate("/passwordReset");
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
        <>
          <div className="w-[100%] flex flex-col ">
            <h1
              className={`text-2xl font-semibold text-roboto leading-[30px] tracking-[0.9px] text-white`}
            >
              Sign In
            </h1>
            <p
              className={`opacity-70 text-base font-[400] leading-[30px] tracking-[0.5px] text-roboto text-white`}
            >
              {`Don't have account? `}
              <span
                onClick={navigateToSignUp}
                className="text-emerald-300 text-base font-normal cursor-pointer underline leading-[30px] tracking-tight text-roboto"
              >
                Sign Up
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
                    <div className="mt-[20px] mb-0">
                      <AuthInput
                        labelText="Email address"
                        idText="email"
                        name="email"
                        htmlForText="email"
                        typeText="text"
                        placeHolderText="Enter email"
                        errText="Email is required"
                        validation={errors?.email && touched?.email}
                        password={false}
                      />
                    </div>
                    <div className="flex flex-col -mt-5 relative ">
                      <AuthInput
                        labelText="Password"
                        idText="password"
                        name="password"
                        htmlForText="password"
                        typeText="password"
                        placeHolderText="Enter Password"
                        errText={errors?.password}
                        validation={errors?.password && touched?.password}
                        password={true}
                        passValue={formValue?.password}
                      />
                      <p
                        onClick={navigatePasswordReset}
                        className={`self-end z-20 -mt-12 mb-5 text-xs font-normal font-['Roboto'] underline leading-normal tracking-[0.3px] cursor-pointer absolute top-[100px] text-[#ffffff] text-opacity-70`}
                      >
                        Forget Password?
                      </p>
                    </div>
                    <div className="mb-3 -mt-3">
                      {loading ? (
                        <LoadingButton />
                      ) : (
                        <AuthButton
                          typeText={"submit"}
                          disabled={
                            errors?.email ||
                            errors?.password ||
                            formValue?.email?.length < 1 ||
                            formValue?.password?.length < 1 ||
                            isSubmitted
                          }
                        >
                          Continue
                        </AuthButton>
                      )}
                    </div>
                    <AutoSubmitToken setFormValue={setFormValue} />
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
                />
                {/* <FacebookButton
                  onLoginSuccess={handleLoginSuccess}
                  onLoginFailure={handleLoginFailure}
                /> */}
              </div>
            </div>
          </div>
          <ToastContainer />
        </>
      }
    />
  );
};

export default SignIn;
