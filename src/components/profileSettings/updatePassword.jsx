/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// import AuthInput from "../auth/authInput";
import AuthButton from "../auth/authButton";
import LoadingButton from "../auth/LoadingButton";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import AutoSubmitToken from "../auth/AutoSubmitToken";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import ProfileInput from "./profileInput";
import AuthInput from "../auth/authInput";

const UpdatePassword = ({ onProfileSuccess, onProfileFailure }) => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    currentPassword: "",
    newPassword: "",
  };

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required("Password is required"),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "Password must be at least 8 characters long")
      .notOneOf(
        [Yup.ref("currentPassword"), null],
        "New password must be different from the current password"
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}auth/reset/password`,
        {
          oldPassword: values?.currentPassword,
          newPassword: values?.newPassword,
          confirmNewPassword: values?.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "Successfully updated password";
      // toast.success(successMessage);
      onProfileSuccess(successMessage);
      setLoading(false);
    } catch (error) {
      console.log(error?.response?.data?.message);
      setLoading(false);
      // toast.error(error?.response?.data?.message ? error?.response?.data?.message : "Please try again");
      onProfileFailure(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Please try again"
      );
    }
  };

  return (
    <div className="w-[100%] h-[100%] flex flex-col ">
      {/* <ToastContainer /> */}
      <div className="">
        <Formik
          initialValues={initialValues}
          validationSchema={passwordValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="flex flex-col">
                <div className="mt-[20px] mb-0">
                  <ProfileInput
                    labelText="Current password"
                    idText="currentPassword"
                    name="currentPassword"
                    htmlForText="currentPassword"
                    typeText="password"
                    placeHolderText="Enter password"
                    errText={errors.currentPassword}
                    validation={
                      errors?.currentPassword && touched?.currentPassword
                    }
                    password={true}
                    profileSettings={true}
                    passValue={formValue?.currentPassword}
                  />
                </div>
                <div className="mt-[20px] mb-0">
                  <ProfileInput
                    labelText="New password"
                    idText="newPassword"
                    name="newPassword"
                    htmlForText="newPassword"
                    typeText="password"
                    placeHolderText="Enter password"
                    errText={errors.newPassword}
                    validation={errors?.newPassword && touched?.newPassword}
                    password={true}
                    profileSettings={true}
                    passValue={formValue?.newPassword}
                  />
                </div>
                <div className="mb-3 -mt-3 w-[107px] self-end">
                  {loading ? (
                    <LoadingButton />
                  ) : (
                    <AuthButton
                      disabled={
                        errors?.currentPassword ||
                        errors?.newPassword ||
                        formValue?.currentPassword?.length < 1 ||
                        formValue?.newPassword?.length < 1
                      }
                    >
                      Update
                    </AuthButton>
                  )}
                </div>
                <AutoSubmitToken setFormValue={setFormValue} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdatePassword;
