/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// import AuthInput from "../auth/authInput";
import AuthButton from "../auth/authButton";
import LoadingButton from "../auth/LoadingButton";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import AutoSubmitToken from "../auth/AutoSubmitToken";
import ProfileImg from "../../assets/profileImage.png";
import CameraImg from "../../assets/camera-alt.png";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import DatePickerInput from "./datePicker";
import moment from "moment/moment";
import ProfileSelect from "./profileSelect";
import ProfileInput from "./profileInput";
import { TailSpin } from "react-loader-spinner";
import NationalitySelect from "./NatioanlitySelect";

const UserDetails = ({ onProfileSuccess, onProfileFailure }) => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [proImgLoading, setProImgLoading] = useState(false);
  const inputRef = useRef(null);
  const [image, setImage] = useState("");
  const [userData, setUserData] = useState();
  const [martialData, setmartialData] = useState([]);
  const [NationalityData, setNationalityData] = useState([]);
  const [nationalityId, setNationalityId] = useState();
  console.log("nationalityData1", NationalityData);  
  const [marId, setmarId] = useState();
  const [dataUpdated, setDataUpdated] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
 

console.log("isDirty", isDirty);
  const initialValues = {
    username: "",
    phoneNumber: "",
    dob1: null,
    address: "",
    // martialStatus: "",
    noOfKids: null,
    fiscalResidence: "",
    nationality: "",
    profileImage: "",
  };


useEffect(() => {
  if (!userData) return;

  const hasChanged =
    nationalityId !== userData?.nationality?.id ||
    marId !== userData?.maritalStatus?.id;

  setIsDirty(hasChanged);
}, [formValue, nationalityId, marId, userData]);


  useEffect(() => {
  const fetchNationalities = async () => {
    try {
      const response = await axios.get(`${baseUrl}country`);
      console.log("nationalitiesData", response?.data?.data);
      setNationalityData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching nationalities:", error);
      toast.error("Failed to load nationalities");
    }
  };

  fetchNationalities();
}, []);
  const profileValidationSchema = Yup.object({
    username: Yup.string()
      .test(
        "isValid",
        "Username should not consist of only numbers or special characters",
        (value) => {
          // Regular expression to check if the string consists of only numbers or special characters
          const regex = /^[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
          return !regex.test(value);
        }
      )
      .max(50, "Username must be less than or equal to 50 characters"),
    phoneNumber: Yup.string().max(
      25,
      "Phone number must be in USA, UAE, or EUR format"
    ),
    // dob1: Yup.date()
    //   .max(new Date(), "Date cannot be earlier than today")
    //   .required("Date is required"),
    address: Yup.string().test(
      "isValid",
      "Username should not consist of only numbers or special characters",
      (value) => {
        // Regular expression to check if the string consists of only numbers or special characters
        const regex = /^[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
        return !regex.test(value);
      }
    ),
    // martialStatus: Yup.string().required("Martial status is required"),
    noOfKids: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .max(19, 'Number of kids must be less than 20'),
        fiscalResidence: Yup.string().test(
      "isValid",
      "Username should not consist of only numbers or special characters",
      (value) => {
        // Regular expression to check if the string consists of only numbers or special characters
        const regex = /^[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
        return !regex.test(value);
      }
    ),
    nationality: Yup.number(),
  });

  const getDOBDate = () => {
    if (formValue?.dob1) {
      const isoString = moment(formValue?.dob1).toISOString();
      return isoString;
    } else {
      return null;
    }
  };

  const getPhoneNumber = () => {
    if (formValue?.phoneNumber) {
      return formValue?.phoneNumber?.toString();
    } else {
      return null;
    }
  };

  // user details post api
  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    const updatedUserDetails = {
      userName: values?.username,
      address: values?.address,
      phone: getPhoneNumber(),
      nationalityId: nationalityId,
      noOfKids: values?.noOfKids,
      dob: getDOBDate(),
      // dob: moment(values?.dob1).format('L'),
      genderId: userData?.gender?.gender,
      // profileImage: image,
      maritalId: marId,
      secEmail: userData?.secEmail,
      fiscalResidence: values.fiscalResidence,
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
      if (response?.data?.status === "success") {
        const successMessage =
          typeof response?.data?.message === "string"
            ? response?.data?.message
            : "profile details successfully updated";
        // toast.success(successMessage, {});
        setIsDirty(false);
        onProfileSuccess(successMessage);
        setLoading(false);
        setDataUpdated(true);
      } else {
        const faildMessage =
          typeof response?.data?.data[0]?.message === "string"
            ? response?.data?.data[0]?.message
            : "profile details updation failed";
        //  toast.error(faildMessage, {});
        onProfileFailure(faildMessage);
        setLoading(false);
        setDataUpdated(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.message === "Validation failed") {
      error.response.data.data.forEach((error) => {
        toast.error(error.message);
      });
    }
      toast.error("Please try again", {});
      setLoading(false);
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
      setUserData(response?.data?.data);
      localStorage.setItem("profileUrl", response?.data?.data?.profileUrl);
      localStorage.setItem("userName", response?.data?.data?.userName);
      setIsDirty(false);
    } catch (error) {
      console.error("Error fetching on user data:", error);
      const errorMessage =
        typeof error?.response?.data?.message === "string"
          ? error?.response?.data?.message
          : "error occuring on loading user details";
      toast.error(errorMessage, {});
    }
  };

  const getMartialDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}marital-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setmartialData(response?.data?.data);
      setIsDirty(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserUserDetails();
    getMartialDetails();
  }, [dataUpdated, image]);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setProImgLoading(true);
    //  setImage(file);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${baseUrl}users/profile`,
        {
          profileImage: event.target.files[0],
          // dob: moment(userData?.dob).format("L"),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setProImgLoading(false);
        setImage(file);
        // toast.success("profile image uploaded successfully", {});
        onProfileSuccess("profile image uploaded successfully");
      } else {
        setProImgLoading(false);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setProImgLoading(false);
      // toast.error("profile image not updated", {});
      onProfileFailure("profile image not updated");
    }
  };

  const getMartialId = (id) => {
    setmarId(id);
  };

  const getNatioanlityId = (id) => {
    setFormValue((prev) => ({
      ...prev,
      nationality: id,
    }));
    setNationalityId(id);
  };



      

  return (
    <div className="w-[100%] h-[100%] flex flex-col items-center">
      {/* <ToastContainer /> */}
      <div className="w-[190px] h-[130px] sm:w-[316px] sm:h-[181px] bg-[#D9D9D9] bg-opacity-10 flex justify-center items-center">
        {proImgLoading ? (
          <div className=" bg-black w-[116px] h-[116px] rounded-[50%] flex justify-center items-center relative">
            <TailSpin
              height="20"
              width="20"
              color="white"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <div className="bg-[#5D5D5D] w-[29px] h-[29px] rounded-[50%] flex justify-center items-center absolute top-[80px] left-[90px] cursor-pointer">
              <img src={CameraImg} alt="camera2" />
            </div>
          </div>
        ) : (
          <div className="relative">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="profile1"
                className=" w-[116px] h-[116px] rounded-[50%]"
              />
            ) : (
              <img
                src={userData?.profileUrl ? userData?.profileUrl : ProfileImg}
                alt="profile2"
                className=" w-[116px] h-[116px] rounded-[50%]"
              />
            )}
            <div
              onClick={handleImageClick}
              className="bg-[#5D5D5D] w-[29px] h-[29px] rounded-[50%] flex justify-center items-center absolute top-[80px] left-[90px] cursor-pointer"
            >
              <img src={CameraImg} alt="camera" />
            </div>
          </div>
        )}

        <input
          type="file"
          ref={inputRef}
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </div>

      <div className="w-[100%] mt-[60px] ">
        <Formik
          initialValues={initialValues}
          validationSchema={profileValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, initialValues }) => {
    useEffect(() => {
      const hasChanged = Object.keys(initialValues).some(
        (key) => values[key] !== initialValues[key]
      );
      setIsDirty(hasChanged);
    }, [values, initialValues]);
return(
            <Form>
              <div className="flex flex-col">
                <div className="w-[100%] flex flex-row justify-between items-center flex-wrap ">
                  <div className="w-[100%] sm:w-[46%]  mt-[0px] mb-0">
                    <ProfileInput
                      labelText="User name"
                      idText="username"
                      name="username"
                      htmlForText="username"
                      typeText="text"
                      placeHolderText="username"
                      errText={errors.username}
                      validation={errors?.username && touched?.username}
                      password={false}
                      userDetails={true}
                      passValue={userData?.userName}
                    />
                  </div>
                  <div className="w-[100%] sm:w-[46%]  mt-[0px] mb-0">
                    <ProfileInput
                      labelText="Phone number"
                      idText="phoneNumber"
                      name="phoneNumber"
                      htmlForText="phoneNumber"
                      typeText="text"
                      placeHolderText="Phone number"
                      errText={errors.phoneNumber}
                      validation={errors?.phoneNumber && touched?.phoneNumber}
                      password={false}
                      userDetails={true}
                      passValue={userData?.phone}
                      // shouldPreventKeys={true}
                    />
                  </div>

                  <div className="w-[100%] sm:w-[46%] mb-[4rem] mt-[-1rem] z-50">
                    <DatePickerInput
                      name="dob1"
                      label="Date of birth"
                      errText={errors.dob1}
                      validation={errors?.dob1 && touched?.dob1}
                      passValue={
                        userData?.dob !== null &&
                        moment(userData?.dob).format("L")
                      }
                      // passValue={moment(userData?.dob).format("L")}
                    />
                  </div>
                  <div className="w-[100%] sm:w-[46%]  -mt-5 mb-0">
                    <ProfileInput
                      labelText="Address"
                      idText="address"
                      name="address"
                      htmlForText="address"
                      typeText="text"
                      placeHolderText="address"
                      errText={errors.address}
                      validation={errors?.address && touched?.address}
                      password={false}
                      userDetails={true}
                      passValue={userData?.address}
                    />
                  </div>
                  <div className="w-[100%] sm:w-[46%]  mb-[60px] -mt-5 sm:-mt-[70px] sm:mb-4 z-10">
                    <ProfileSelect
                      passValue={userData?.maritalStatus}
                      martialData={martialData}
                      getMartialId={getMartialId}
                    />
                  </div>
                  <div className="w-[100%] sm:w-[46%]  -mt-5 mb-0">
                    <ProfileInput
                      labelText="Number of kids"
                      idText="noOfKids"
                      name="noOfKids"
                      htmlForText="noOfKids"
                      typeText="number"
                      placeHolderText="noOfKids"
                      errText={errors.noOfKids}
                      validation={errors?.noOfKids && touched?.noOfKids}
                      password={false}
                      userDetails={true}
                      passValue={userData?.noOfKids}
                      shouldPreventKeys={true}
                    />
                  </div>
                  <div className="w-[100%] sm:w-[46%]  -mt-5 mb-0">
                    <ProfileInput
                      labelText="Fiscal residence"
                      idText="fiscalResidence"
                      name="fiscalResidence"
                      htmlForText="fiscalResidence"
                      typeText="text"
                      placeHolderText="fiscalResidence"
                      errText={errors.fiscalResidence}
                      validation={
                        errors?.fiscalResidence && touched?.fiscalResidence
                      }
                      password={false}
                      userDetails={true}
                      passValue={userData?.fiscalResidence}
                    />
                  </div>
                  <div className="w-[100%] sm:w-[46%] -mt-5 mb-10">
                    <NationalitySelect
                      passValue={userData?.nationality}
                      NationalityData={NationalityData}
                      getNatioanlityId={getNatioanlityId}
                      />
                  </div>
                </div>
                <div className="mb-3 mt-10 w-[107px] self-end">
                  {loading ? (
                    <LoadingButton />
                  ) : (
                    <AuthButton disabled={!isDirty} >Update</AuthButton>
                  )}
                </div>
                <AutoSubmitToken setFormValue={setFormValue} />
              </div>
            </Form>
          )}}
        </Formik>
      </div>
    </div>
  );
};

export default UserDetails;
