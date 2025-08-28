/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
//import AuthInput from "../auth/authInput";
import AuthButton from "../auth/authButton";
import LoadingButton from "../auth/LoadingButton";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import AutoSubmitToken from "../auth/AutoSubmitToken";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import ProfileInput from "./profileInput";
import moment from "moment/moment";

const UserEmail = ({ onProfileSuccess, onProfileFailure }) => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState("");
  const [dataUpdated, setDataUpdated] = useState(false);

  const initialValues = {
    currentEmail: "",
    secondaryEmail: "",
  };

  const profileValidationSchema = Yup.object({
    currentEmail: Yup.string()
      .email("Email must be a valid email")
      .required("Email is required"),
    secondaryEmail: Yup.string().email("Email must be a valid email"),
    // .required("Email is required")
    // .notOneOf(
    //   [Yup.ref('currentEmail')],
    //   'Secondary email must be different from the current email'
    // ),
  });

  // user details post api
  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    const updatedUserDetails = {
      secEmail: values?.secondaryEmail,
      // dob: moment(profileData?.dob).format("L"),
    };
    try {
      const response = await axios.post(
        `${baseUrl}users/profile`,
        updatedUserDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "Successfully updated Secondary email";
      // toast.success(successMessage, {});
      onProfileSuccess(successMessage);
      setLoading(false);
      setDataUpdated(true);
    } catch (error) {
      console.log(error);
      const errorMessage =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "Secondary email updation failed";
      // toast.error(errorMessage, {});
      onProfileFailure(errorMessage);
    }
  };

  // user details get api
  const getUserUserDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}users/profile/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response?.data?.data);
      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "user email loaded successfully";
      // console.log(successMessage, {});
    } catch (error) {
      console.error("Error fetching on user data:", error);
      const errorMessage =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "error occuring on loading user email";
      toast.error(errorMessage, {});
    }
  };

  useEffect(() => {
    getUserUserDetails();
  }, [dataUpdated]);

  return (
    <div className="w-[100%] h-[100%] flex flex-col ">
      {/* <ToastContainer /> */}
      <div className="">
        <Formik
          initialValues={initialValues}
          validationSchema={profileValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="flex flex-col">
                <div className="mt-[20px] mb-0">
                  <ProfileInput
                    labelText="Current email"
                    idText="currentEmail"
                    name="currentEmail"
                    htmlForText="currentEmail"
                    typeText="text"
                    placeHolderText="Enter email"
                    errText="Email is required"
                    validation={errors?.currentEmail && touched?.currentEmail}
                    password={false}
                    profileSettings={true}
                    currEmailvalue={profileData?.email}
                  />
                </div>
                <div className="mt-[20px] mb-0">
                  <ProfileInput
                    labelText="Secondary email"
                    idText="secondaryEmail"
                    name="secondaryEmail"
                    htmlForText="secondaryEmail"
                    typeText="text"
                    placeHolderText="Enter email"
                    errText="Email is required"
                    validation={
                      errors?.secondaryEmail && touched?.secondaryEmail
                    }
                    password={false}
                    profileSettings={true}
                    // passValue={profileData?.secEmail}
                  />
                </div>
                <div className="mb-3 -mt-3 w-[107px] self-end">
                  {loading ? (
                    <LoadingButton />
                  ) : (
                    <AuthButton
                      type={"submit"}
                      disabled={
                        errors?.currentEmail ||
                        errors?.secondaryEmail ||
                        formValue?.currentEmail?.length < 1 ||
                        formValue?.secondaryEmail?.length < 1 ||
                        profileData?.email === formValue?.secondaryEmail
                        // dataUpdated
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

export default UserEmail;
