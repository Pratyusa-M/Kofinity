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
import { useNavigate, useLocation } from "react-router-dom";
import EditCountrySelect from "../../components/editAssets/editCountrySelect";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import DummySelect from "../../components/common/dummyInput";
import CountrySelect from "../../components/addAssets/countrySelect";
import { useDispatch, useSelector } from "react-redux";
import {
  setRealEstateName,
  selectedRealEstateName,
} from "../../redux/store/slice/portfolioSlice";

// import { selectedMainCurrencyId } from "../../redux/store/slice/currencySlice";

import {
  setEditRealEstateCurrency,
  selectedEditRealEstateCurrency,
  selecteEditRealEstateCurrencyId,
  setEditRealEstateCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";

const EditRealEstateS1 = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [realEstateData, setRealEstateData] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [countryId, setCountryId] = useState();
  const [dataUpdated, setDataUpdated] = useState(false);
  const [countryText, setCountryText] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedRealEstName = useSelector(selectedRealEstateName);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);
  const selecteddCurrencyId = useSelector(selecteEditRealEstateCurrencyId);

  // const editId =  location?.state?.editId ;
  const editId = localStorage.getItem("editid");
  // const assetName = location?.state?.editName

  const options = [
    { id: 1, option: "India" },
    { id: 2, option: "USA" },
    { id: 3, option: "London" },
  ];

  useEffect(() => {
    getCountryData();
    getRealEstateDataById();
  }, [dataUpdated]);

  const getRealEstateDataById = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}real-estate/${editId}?desiredCurrency=${selecteddCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRealEstateData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

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
    } catch (error) {
      console.log(error.message);
    }
  };

  const initialValues = {
    address1: "",
    address2: "",
    postCode: "",
  };

  const assetValidationSchema = Yup.object({
    address1: Yup.string().required("address1 is required"),
    address2: Yup.string().required("address2 is required"),
    postCode: Yup.string().required("postal code is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.put(
        `${baseUrl}real-estate/${editId}`,
        {
          country: countryId,
          address_line1: values?.address1,
          address_line2: values?.address2,
          postal_code: values?.postCode.toString(),
          currency: selecteddCurrencyId,
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
          : "Successfully updated real estate details";
      toast.success(successMessage);
      setLoading(false);
      setDataUpdated(true);

      setTimeout(() => {
        OnNavigateRealEstatePage2(editId);
      }, 3000);
    } catch (error) {
      console.log(error?.response?.data?.message);
      setLoading(false);
      setIsButtonDisabled(false);
      toast.error(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Please try again"
      );
    }
  };

  const OnNavigateRealEstatePage2 = (id) => {
    // navigate("/addAssets", { state: { openModal: true } });
    navigate("/editrealestate2", { state: { editId: id } });
    setIsButtonDisabled(false);
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
      heading={selectedRealEstName}
      backRoute={"/realestate"}
      closeRoute={"/realestate"}
      isRealEstate={true}
      barWidth={"1/3"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Edit Real Estate
            </h1>
            <Formik
              initialValues={initialValues}
              // validationSchema={assetValidationSchema}
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
                          passId={realEstateData?.country?.id}
                          passOpt={realEstateData?.country?.option}
                          setText={setCountryText}
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
                        errText={errors.address1}
                        validation={errors?.address1 && touched?.address1}
                        password={false}
                        passValue={realEstateData?.address_line1}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[24px] mb-0 w-[100%]">
                      <AssetInput
                        labelText="Address Line 2"
                        idText="address2"
                        name="address2"
                        htmlForText="address2"
                        typeText="text"
                        placeHolderText=""
                        errText={errors.address2}
                        validation={errors?.address2 && touched?.address2}
                        password={false}
                        passValue={realEstateData?.address_line2}
                        // profileSettings={true}
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
                        errText={errors.postCode}
                        // validation={errors?.postCode && touched?.postCode}
                        password={false}
                        passValue={realEstateData?.postal_code}
                        shouldPreventKeys={true}
                        // profileSettings={true}
                      />
                    </div>

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="flex items-center gap-3 self-end">
                    <div className="mb-3 mt-10 W-[150px]">
                      <AssetButton
                        onClick={() => OnNavigateRealEstatePage2(editId)}
                      >
                        Continue
                      </AssetButton>
                    </div>
                    <div className="mb-3 mt-10 W-[150px]">
                      {loading ? (
                        <LoadingButton />
                      ) : (
                        <AssetButton typeText={"submit"} disabled={ isButtonDisabled}>Update</AssetButton>
                      )}
                    </div>
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

export default EditRealEstateS1;
