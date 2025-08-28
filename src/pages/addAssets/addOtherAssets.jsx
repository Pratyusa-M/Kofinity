/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import AssetInput from "../../components/addAssets/assetInput";
import AssetSelect from "../../components/addAssets/assestSelect";
import AssetDatePickerInput from "../../components/addAssets/assetDatePicker";
import AssetPriceInput from "../../components/addAssets/priceInput";
import LoadingButton from "../../components/auth/LoadingButton";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import AssetButton from "../../components/addAssets/assetButton";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import AssetTypeSelect from "../../components/addAssets/assetTypeSelect";
import BankSelect from "../../components/addAssets/bankSelect";
import LinkBankSelect from "../../components/addAssets/linkBankSelect";
import DummySelect from "../../components/common/dummyInput";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import OtherAssetBrokerageSelect2 from "../../components/addAssets/otherAssetBrokerageSelect2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddOtherAssetCurrency,
  selectedAddOtherAssetCurrency,
  selectedAddOtherAssetCurrencyId,
  setAddOtherAssetCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import CurrentPriceDate from "../../components/addAssets/currentPriceDate";
import format from "date-fns/format";
import moment from "moment/moment";

const getCurrentTime = () => {
  const currentDate = new Date();
  const formattedDate = moment(currentDate).format("YYYY-MM-DD");
  // "h:mm a" for time in AM/PM format, "MM/dd/yyyy" for date
  if (formattedDate) {
    return formattedDate;
  } else {
    return "03/06/2024";
  }
};

const getFormValuesData = () => {
  const formData = localStorage.getItem("OtherAssetFormData");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const getAssetTypeData = (num) => {
  const data = localStorage.getItem("otherAssetDropDownData");
  if (data !== null && data !== undefined) {
    const dataa = JSON.parse(data);
    if (num === 1) {
      return dataa.assetTypeId;
    } else {
      return dataa.assetTypeText;
    }
  } else {
    if (num === 1) {
      return null;
    } else {
      return "";
    }
  }
};

const AddOtherAssets = () => {
  const [formValue, setFormValue] = useState();
  const [formData, setFormValues] = useState(getFormValuesData());

  const [loading, setLoading] = useState(false);
  const [assetTypeData, setAssetTypeData] = useState([]);
  const [banksData, setBanksData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [assetTypeId, setAssetTypeId] = useState(getAssetTypeData(1));
  const [assetTypeText, setAssetTypeText] = useState(getAssetTypeData(2));
  const [bankId, setBankId] = useState(null);
  const [currencyData, setCurrencyData] = useState([]);
  const [curentDate, setCurrentDate] = useState(getCurrentTime());
  const dispatch = useDispatch();
  const selectedOCurrency = useSelector(selectedAddOtherAssetCurrency);
  const selectedOCurrencyId = useSelector(selectedAddOtherAssetCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const navigate = useNavigate();
 
  const sCode = sessionStorage.getItem("otherSCode")

 
  console.log(sCode, 'vinay codeee')
  const options = [
    { id: 1, name: "Account 1" },
    { id: 2, name: "Account 2" },
    { id: 3, name: "Account 2" },
  ];

  useEffect(() => {
    const data = { ...formData };
    localStorage.setItem("OtherAssetFormData", JSON.stringify(data));
  }, [formData]);

  useEffect(() => {
    const data = {
      assetTypeId: assetTypeId,
      assetTypeText: assetTypeText,
    };
    localStorage.setItem("otherAssetDropDownData", JSON.stringify(data));
  }, [assetTypeId]);

  useEffect(() => {
    getAssetTypes();
    getBanks();
    // getCurrencyData();
  }, []);

  useEffect(() => {
    if (bankId === bankDataLength) {
      navigate("/addbankaccount2", {
        state: { addBankRoute: "/addotherassets" },
      });
    } 
  }, [bankId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currApiSuccCond) {
      dispatch(fetchCurrencyOptionsApi(token));
    }
  }, []);

  const getCurrencyData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}options?subtype=currency`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrencyData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBanks = async () => {
    const token = localStorage.getItem("token");
    try {
      const banksResponse = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selectedOCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = banksResponse?.data?.data;
      //   data.forEach(item => {
      //     const accountNumber = item.account_number.toString(); // Convert account number to string
      //     const lastFourDigits = accountNumber.slice(-4); // Get last four digits
      //     const hiddenDigits = '*'.repeat(accountNumber.length - 4); // Create string of asterisks for hidden digits
      //     const modifiedName = `${item.bank_name.name}( ${hiddenDigits}${lastFourDigits} )`; // Concatenate modified name
      //     item.bank_name.name = modifiedName; // Update bank name
      // });

      data.forEach((item) => {
        const accountNumber = item.account_number.toString(); // Convert account number to string
        let modifiedName = "";
        if (accountNumber.length >= 4) {
          const lastFourDigits = accountNumber.slice(-4); // Get last four digits
          const hiddenDigits = "*".repeat(accountNumber.length - 4); // Create string of asterisks for hidden digits
          modifiedName = `${item.bank_name.name}( ${hiddenDigits}${lastFourDigits} )`; // Concatenate modified name
        } else {
          modifiedName = `${item.bank_name.name}( ${accountNumber} )`; // Concatenate bank name with full account number
        }
        item.bank_name.name = modifiedName; // Update bank name
      });
      const length = banksResponse?.data?.data?.length;
      setbankDataLength(length + 1);
      const newObj = {
        id: length + 1,
        bank_name: { name: "Add new bank account" },
      };

      const emptyObj = {
        id: null,
        bank_name: { name: "None" },
      };
      const banksData = [emptyObj, ...data, newObj];
      setBanksData(banksData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAssetTypes = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}asset-types`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssetTypeData(response?.data?.data);
      console.log(response?.data?.data, "asset data");
    } catch (error) {
      console.log(error.message);
    }
  };

  const initialValues = {
    assetName: formData.assetName || "",
    PurDate: formData.PurDate || "",
    // cpDate: "",
    curPrice: formData.curPrice || null,
    purPrice: formData.purPrice || null,
  };

  const otherAssetValidationSchema = Yup.object({
    assetName: Yup.string().required("stock name is required"),

    PurDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    // cpDate: Yup.date()
    //   .max(new Date(), "Date cannot be earlier than today")
    //   .required("Date is required"),
    purPrice: Yup.string().required("purchase price is required"),
    // curPrice: Yup.string().required("current price is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}other-asset`,
        {
          asset_name: values?.assetName,
          asset_type: assetTypeId,
          purchase_price: values?.purPrice,
          current_price: values?.curPrice,
          purchase_date: moment(values?.PurDate).format("YYYY-MM-DD"),
          current_price_date: curentDate,
          bank_account: bankId,
          currency: selectedOCurrencyId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      const successMessage =
        typeof response?.data?.message === "string"
          ? response?.data?.message
          : "Successfully add bank details";
      toast.success(successMessage);
      setLoading(false);
      OnNavigateAssetspage();
      setTimeout(() => {
        // navigate('/addAssets')
      }, 2000);
    } catch (error) {
      console.log(error?.response?.data?.message);
      setLoading(false);
      toast.error(
        error?.response?.data?.message
          ? error?.response?.data?.message
          : "Please try again"
      );
    }
  };

  const OnNavigateAssetspage = () => {
    navigate("/addAssets", { state: { openModal: true } });
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setAddOtherAssetCurrency(currency.option));
    dispatch(setAddOtherAssetCurrencyId(currency.id));
  };

  const { PurDate } = formData;
  const purchaseDate = PurDate ? moment(PurDate).format("L") : "";

  return (
    <AssetLayout
      heading={"Other Assets"}
      backRoute={"/addAssets"}
      closeRoute={"/addAssets"}
      jsxProp={
        <>
          <ToastContainer />
        <div className="">
          <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
            Add Other Assets
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={otherAssetValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col">
                <div className="flex flex-row justify-between flex-wrap">
                  <div className="mt-[0px] sm:-mt-[9px] mb-0 w-[100%] sm:w-[47%]">
                    <AssetInput
                      labelText="Asset name"
                      idText="assetName"
                      name="assetName"
                      htmlForText="assetName"
                      typeText="text"
                      placeHolderText=""
                      errText="asset name name is required"
                      validation={errors?.assetName && touched?.assetName}
                      password={false}
                      setFormValues={setFormValues}
                      isSetFormValues={true}
                      passValue={formData?.assetName}
                      // profileSettings={true}
                    />
                  </div>
                  <div className="mt-[24px] sm:mt-[0px] mb-0 w-[100%] sm:w-[47%] z-50">
                    {assetTypeData?.length > 0 ? (
                      <AssetTypeSelect
                        data={assetTypeData}
                        placeholder={"Asset type"}
                        setId={setAssetTypeId}
                        setText={setAssetTypeText}
                        passText={assetTypeText}
                      />
                    ) : (
                      loadingDummyInput("Asset type")
                    )}
                  </div>
                  <div className="mt-[12px] sm:mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                    <AssetPriceInput
                      labelText="Purchase price"
                      idText="purPrice"
                      name="purPrice"
                      htmlForText="purPrice"
                      typeText="number"
                      placeHolderText=""
                      errText={errors?.purPrice}
                      validation={errors?.purPrice && touched?.purPrice}
                      curData={currencyOptionsData}
                      settingCurrency={setAddStcksCurr}
                      selectedCurrency={selectedOCurrency}
                      shouldPreventKeys={true}
                      setFormValues={setFormValues}
                      isSetFormValues={true}
                      passValue={formData?.purPrice}
                    />
                  </div>
                  <div className="mt-[20px] mb-[4rem] w-[100%] sm:w-[47%]">
                    <AssetDatePickerInput
                      name="PurDate"
                      label="Purchase date(mm/dd/yyyy)"
                      errText={errors.PurDate}
                      validation={errors?.PurDate && touched?.PurDate}
                      isShowFutureDates={true}
                      setFormValues={setFormValues}
                      passValue={purchaseDate}
                      isSetFormValues={true}
                    />
                  </div>
                  <div className="-mt-[26px] sm:-mt-[22px] mb-0 w-[100%] sm:w-[47%]">
                    <AssetPriceInput
                      labelText="Current price(Optional)"
                      idText="curPrice"
                      name="curPrice"
                      htmlForText="curPrice"
                      typeText="number"
                      placeHolderText=""
                      // errText={errors?.curPrice}
                      // validation={errors?.curPrice && touched?.curPrice}
                      curData={currencyOptionsData}
                      settingCurrency={setAddStcksCurr}
                      selectedCurrency={selectedOCurrency}
                      shouldPreventKeys={true}
                      setFormValues={setFormValues}
                      isSetFormValues={true}
                      passValue={formData?.curPrice}
                    />
                  </div>
                  {/* <div className="mt-[24px] sm:-mt-[22px] mb-0 w-[100%] sm:w-[47%]"> */}
                  <div className="mt-[24px] sm:-mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                    {/* <AssetDatePickerInput
                      name="cpDate"
                      label="Current price date(dd/mm/yyyy)"
                      errText={errors.cpDate}
                      validation={errors?.cpDate && touched?.cpDate}
                    /> */}
                    <CurrentPriceDate
                      labelText="Current price date(mm/dd/yyyy)"
                      idText="currTime"
                      name="currTime"
                      htmlForText="currTime"
                      typeText="text"
                      placeHolderText=""
                      errText={errors.currTime}
                      validation={errors?.currTime && touched?.currTime}
                      password={false}
                      value={""}
                      // profileSettings={true}
                    />
                  </div>
                  <div className="mt-[28px] mb-0 w-[100%] sm:w-[47%]">
                    {/* {banksData?.length>0 ?
                    <LinkBankSelect
                      data={banksData}
                      placeholder={"Link bank account"}
                      setId={setBankId}
                    />:loadingDummyInput('Link Bank account')} */}
                    {banksData?.length > 0 ? (
                      <OtherAssetBrokerageSelect2
                        data={banksData}
                        placeholder={"Brokerage account(Optional)"}
                        setId={setBankId}
                        dataLength={banksData?.length}
                        sCode = {sCode}
                      />
                    ) : (
                      loadingDummyInput("Brokerage account(Optional)")
                    )}
                  </div>

                  <AutoSubmitToken setFormValue={setFormValue} />
                </div>
                <div className="mb-0 mt-[54px] W-[150px] self-end">
                  {loading ? (
                    <LoadingButton />
                  ) : (
                    <AssetButton
                      typeText={"submit"}
                      disabled={
                        errors?.assetName ||
                        errors?.purQuantity ||
                        formValue?.assetName?.length < 1 ||
                        formValue?.purQuantity?.length < 1 ||
                        // errors?.cpDate ||
                        errors?.PurDate ||
                        // formValue?.cpDate?.length < 1 ||
                        formValue?.PurDate?.length < 1 ||
                        errors?.purPrice ||
                        formValue?.purPrice?.length < 1 ||
                        // errors?.curPrice ||
                        // formValue?.curPrice?.length < 1 ||
                        assetTypeId === null
                      }
                      // onClick={OnNavigateAssetspage}
                    >
                      CONFIRM
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

export default AddOtherAssets;
