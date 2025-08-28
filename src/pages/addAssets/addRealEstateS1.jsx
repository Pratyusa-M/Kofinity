/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import AssetInput from "../../components/addAssets/assetInput";
import AssetSelect from "../../components/addAssets/assestSelect";
import LoadingButton from "../../components/auth/LoadingButton";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import AssetButton from "../../components/addAssets/assetButton";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import CountrySelect from "../../components/addAssets/countrySelect";
import DummySelect from "../../components/common/dummyInput";

import axios from "axios";

const getFormValuesData = () => {
  const formData = localStorage.getItem("formData1");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const getCountryId = (num) => {
  const data = localStorage.getItem("realDropDownData1");
  if (data !== null && data !== undefined) {
    const dataa = JSON.parse(data);
    if (num === 1) {
      return dataa.countId;
    } else {
      return dataa.countText;
    }
  } else {
    if (num === 1) {
      return null;
    } else {
      return "";
    }
  }
};

const AddRealEstateS1 = () => {
  const [formValue, setFormValue] = useState();
  const [formData, setFormValues] = useState(getFormValuesData());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [realEstateData, setRealEstateData] = useState();
  const [countryOptions, setCountryOptions] = useState([]);
  const [countryId, setCountryId] = useState(getCountryId(1));
  const [countryText, setCountryText] = useState(getCountryId(2));

  useEffect(() => {
    const data = { ...formData, countryId: countryId };
    localStorage.setItem("formData1", JSON.stringify(data));
  }, [formData, countryId]);

  useEffect(() => {
    const data = {
      countId: countryId,
      countText: countryText,
    };
    localStorage.setItem("realDropDownData1", JSON.stringify(data));
  }, [countryId]);

  const options = [
    { id: 1, option: "India" },
    { id: 2, option: "USA" },
    { id: 3, option: "London" },
  ];

  useEffect(() => {
    getCountryData();
  }, []);

  const getCountryData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}lists?subtype=country`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // setRealEstateData(response?.data?.data);
      const countryArray = response?.data?.data;
      setCountryOptions(countryArray);
      // console.log(RealEstateResponse?.data?.data,'real estate data')
    } catch (error) {
      console.log(error.message);
    }
  };

  const initialValues = {
    address1: formData.address1 || "",
    address2: formData.address2 || "",
    postCode: formData.postCode || "",
  };

  const assetValidationSchema = Yup.object({
    address1: Yup.string().required("address1 is required"),
  });

  const handleSubmit = async (values) => {
    OnNavigateRealEstatePage2(values);
  };

  const OnNavigateRealEstatePage2 = (values) => {
    // navigate("/addAssets", { state: { openModal: true } });
    const newState = {
      ...values,
      country: countryId,
    };
    navigate("/addrealestate2", { state: newState });
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  return (
    <AssetLayout
      heading={"Real Estate"}
      backRoute={"/addAssets"}
      closeRoute={"/addAssets"}
      isRealEstate={true}
      barWidth={"1/3"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Add Real Estate
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={assetValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col">
                  <div className="flex flex-row justify-between flex-wrap">
                    <div className=" mb-0 w-[100%]">
                      {countryOptions?.length > 0 ? (
                        <CountrySelect
                          data={countryOptions}
                          placeholder={"Country"}
                          setId={setCountryId}
                          setText={setCountryText}
                          // passId={formData?.countryId}
                          passText={countryText}
                        />
                      ) : (
                        loadingDummyInput("Country")
                      )}
                    </div>
                    <div className="mt-[20px] mb-0 w-[100%]">
                      <AssetInput
                        labelText="Address Line 1"
                        idText="address1"
                        name="address1"
                        htmlForText="address1"
                        typeText="text"
                        placeHolderText=""
                        errText="address1 is required"
                        validation={errors?.address1 && touched?.address1}
                        password={false}
                        setFormValues={setFormValues}
                        passValue={formData?.address1}
                        isSetFormValues={true}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[24px] mb-0 w-[100%]">
                      <AssetInput
                        labelText="Address Line 2(optional)"
                        idText="address2"
                        name="address2"
                        htmlForText="address2"
                        typeText="text"
                        placeHolderText=""
                        errText="address2 is required"
                        // validation={errors?.address2 && touched?.address2}
                        password={false}
                        // profileSettings={true}
                        setFormValues={setFormValues}
                        passValue={formData?.address2}
                        isSetFormValues={true}
                      />
                    </div>
                    <div className="mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Postal Code(optional)"
                        idText="postCode"
                        name="postCode"
                        htmlForText="postCode"
                        typeText="number"
                        placeHolderText=""
                        errText="postCode is required"
                        // validation={errors?.postCode && touched?.postCode}
                        password={false}
                        // profileSettings={true}
                        setFormValues={setFormValues}
                        passValue={formData?.postCode}
                        isSetFormValues={true}
                        shouldPreventKeys={true}
                      />
                    </div>

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-3  W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton
                        typeText={"submit"}
                        disabled={
                          errors?.address1 ||
                          formValue?.address1?.length < 1 ||
                          countryId === null
                        }
                        // onClick={OnNavigateRealEstatePage2}
                      >
                        Continue
                      </AssetButton>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </>
      }
    />
  );
};

export default AddRealEstateS1;
