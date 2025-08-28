import AuthInput from "../../components/auth/authInput";
import AuthButton from "../../components/auth/authButton";
import AuthLayout from "../../components/layout/authLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { baseUrl } from "../../utils/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingButton from "../../components/auth/LoadingButton";
import axios from "axios";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState();

  // params fetch
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const initialValues = {
    newPassword: "",
    RePassword: "",
  };

  const registerValidationSchema = Yup.object({
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    RePassword: Yup.string().oneOf(
      [Yup.ref("newPassword")],
      "Passwords must match"
    ),
  });

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}auth/reset/password/afterforgot?token=${token}`,
        {
          newPassword: formValue?.newPassword,
          confirmNewPassword: formValue?.RePassword,
        }
      );
      toast.success(response?.data?.message);
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("reset failed:", error);
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
            className={`text-2xl font-semibold text-roboto mt-5  leading-[30px] tracking-[1.2px]
              text-white
            `}
          >
            Reset Password
          </h1>
          <p
            className={`opacity-70 mb-5 text-base font-normal leading-[30px] tracking-[0.5px] text-roboto text-white`}
          >
            Please reset your password
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={registerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mt-7 ">
                  <AuthInput
                    labelText="New password"
                    idText={"new password"}
                    name={"newPassword"}
                    htmlForText={"new password"}
                    typeText={"password"}
                    placeHolderText={"Enter Password"}
                    errText={errors?.newPassword}
                    validation={
                      errors?.newPassword && touched?.newPassword ? true : false
                    }
                    password={true}
                    passValue={formValue?.newPassword}
                  />
                </div>
                <div className="-mt-4">
                  <AuthInput
                    labelText="Confirm password"
                    idText={"confirm password"}
                    name={"RePassword"}
                    htmlForText={"confirm password"}
                    typeText={"password"}
                    placeHolderText={"Re-enter Password"}
                    errText={errors?.RePassword}
                    validation={
                      errors?.RePassword && touched?.RePassword ? true : false
                    }
                    password={true}
                    passValue={formValue?.RePassword}
                  />
                </div>
                <AutoSubmitToken setFormValue={setFormValue} />

                <div className="mb-3 -mt-2">
                  {loading ? (
                    <LoadingButton />
                  ) : (
                    <AuthButton
                      disabled={
                        errors?.newPassword ||
                        errors?.RePassword ||
                        formValue?.newPassword?.length < 1 ||
                        formValue?.RePassword?.length < 1
                      }
                      onClick={handleSubmit}
                    >
                      Continue
                    </AuthButton>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      }
    />
  );
};
export default ResetPassword;
