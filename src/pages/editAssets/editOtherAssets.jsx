/* eslint-disable react-hooks/exhaustive-deps */
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
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import DummySelect from "../../components/common/dummyInput";
import AssetTypeSelect from "../../components/addAssets/assetTypeSelect";
import LinkBankSelect from "../../components/addAssets/linkBankSelect";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditOtherAssetCurrency,
  selectedEditOtherAssetCurrency,
  selectedEditOtherAssetCurrencyId,
  setEditOtherAssetCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import {
  setEditId,
  selectedEditId,
} from "../../redux/store/slice/portfolioSlice";

const EditOtherAssets = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [assetTypeData, setAssetTypeData] = useState([]);
  const [otherAssetsData, setOtherAssetsData] = useState();
  const [banksData, setBanksData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [assetTypeId, setAssetTypeId] = useState(1);
  const [bankId, setBankId] = useState(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedEditOtherAssetCurrency);
  const selecteddCurrencyId = useSelector(selectedEditOtherAssetCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const editingId = useSelector(selectedEditId);

  const navigate = useNavigate();
  const location = useLocation();
  const editId = location?.state?.editId;
  const assetName = location?.state?.editName;

  useEffect(() => {
    if (editId) {
      dispatch(setEditId(editId));
    }
  }, [editId]);

  useEffect(() => {
    if (editingId) {
      getOtherAssetsData();
    }
  }, [editingId, editId]);

  useEffect(() => {
    // getOtherAssetsData();
    getAssetTypes();
    getBanks();
    // getCurrencyData();
  }, [dataUpdated]);

  useEffect(() => {
    if (bankId === bankDataLength) {
      navigate("/addbankaccount2", {
        state: { addBankRoute: "/editotherassets" },
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

  const getOtherAssetsData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}other-asset/${editId}?desiredCurrency=${selecteddCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOtherAssetsData(response?.data?.data);
      // setBrokeragId(response?.data?.data?.id)
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBanks = async () => {
    const token = localStorage.getItem("token");
    try {
      const banksResponse = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selecteddCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = banksResponse?.data?.data;
      // data.forEach((item) => {
      //   const accountNumber = item.account_number.toString(); // Convert account number to string
      //   const lastFourDigits = accountNumber.slice(-4); // Get last four digits
      //   const hiddenDigits = "*".repeat(accountNumber.length - 4); // Create string of asterisks for hidden digits
      //   const modifiedName = `${item.bank_name.name}( ${hiddenDigits}${lastFourDigits} )`; // Concatenate modified name
      //   item.bank_name.name = modifiedName; // Update bank name
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
      const banksData = [...data, newObj];
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
    } catch (error) {
      console.log(error.message);
    }
  };

  const options = [
    { id: 1, opt: "Account 1" },
    { id: 2, opt: "Account 2" },
    { id: 3, opt: "Account 2" },
  ];

  const initialValues = {
    assetName: "",
    PurDate: "",
    cpDate: "",
    curPrice: "",
    purPrice: "",
  };

  const otherAssetValidationSchema = Yup.object({
    assetName: Yup.string().required("Asset name is required"),

    PurDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    cpDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    // Commission: Yup.string().required("Commision is required"),
    purPrice: Yup.string().required("purchase price is required"),
    // curPrice: Yup.string().required("current price is required"),
  });

  const getDateString = (date) => {
    const d = new Date(date);
    const isoDate = moment(d.toISOString()).format("YYYY-MM-DD");
    return isoDate;
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.put(
        `${baseUrl}other-asset/${editId}`,
        {
          asset_name: values?.assetName,
          asset_type: assetTypeId,
          purchase_price: values?.purPrice,
          // current_price: values?.curPrice,
          // "purchase_date":values?.PurDate,
          purchase_date: getDateString(values?.PurDate),
          // "current_price_date": values?.cpDate,
          // current_price_date: getDateString(values?.cpDate),
          bank_account: bankId,
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
          : "Successfully updated other assets";
      toast.success(successMessage);
      // setDataUpdated(true);
      setLoading(false);
      setTimeout(() => {
        navigate("/otherassets");
        setIsButtonDisabled(false);
      }, 3000);
      setTimeout(() => {
        // setDataUpdated(true)
      }, 2000);
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

  //  moment(values?.dob1).format("L")

  const setAddStcksCurr = (currency) => {
    dispatch(setEditOtherAssetCurrency(currency.option));
    dispatch(setEditOtherAssetCurrencyId(currency.id));
  };

  // const getPassedBankAccount = () => {
  //   const bankName = otherAssetsData?.bank_account?.bank_name?.name;
  //   const accNo = otherAssetsData?.bank_account?.account_number;

  //   if (bankName && accNo) {
  //     const accNum = accNo.toString();
  //     const lastFourDigits = accNum?.slice(-4);

  //     const maskedAccNo = "*".repeat(accNum?.length - 4) + lastFourDigits;

  //     const concatenated = `${bankName} ( ${maskedAccNo}) `;

  //     return concatenated;
  //   }

  //   return null;
  // };

  const getPassedBankAccount = () => {
    const bankName = otherAssetsData?.bank_account?.bank_name?.name;
    const accNo = otherAssetsData?.bank_account?.account_number;

    if (bankName && accNo) {
      const accNum = accNo.toString();
      if (accNum) {
        const lastFourDigits = accNum?.slice(-4);
        if (accNum.length >= 4) {
          const maskedAccNo = "*".repeat(accNum?.length - 4) + lastFourDigits;
          const concatenated = `${bankName} ( ${maskedAccNo}) `;
          return concatenated;
        } else {
          // If the account number has less than 4 digits, concatenate it directly without masking
          const concatenated = `${bankName} ( ${accNum}) `;
          return concatenated;
        }
      }
    }

    return null;
  };

  return (
    <AssetLayout
      heading={assetName}
      backRoute={"/otherassets"}
      closeRoute={"/otherassets"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Edit Other Assets
            </h1>
            <Formik
              initialValues={initialValues}
              // validationSchema={otherAssetValidationSchema}
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
                        errText={errors.assetName}
                        validation={errors?.assetName && touched?.assetName}
                        password={false}
                        passValue={otherAssetsData?.asset_name}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[0px] mb-0 w-[100%] sm:w-[47%]">
                      {assetTypeData?.length > 0 ? (
                        <AssetTypeSelect
                          data={assetTypeData}
                          placeholder={"Asset type"}
                          setId={setAssetTypeId}
                          passId={otherAssetsData?.asset_type?.id}
                          passOpt={otherAssetsData?.asset_type?.name}
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
                        errText={errors.purPrice}
                        validation={errors?.purPrice && touched?.purPrice}
                        passValue={otherAssetsData?.purchase_price}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[20px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="PurDate"
                        label="Purchase date(mm/dd/yyyy)"
                        errText={errors.PurDate}
                        validation={errors?.PurDate && touched?.PurDate}
                        passValue={moment(
                          otherAssetsData?.purchase_date
                        ).format("L")}
                        isShowFutureDates={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:-mt-[22px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="cpDate"
                        label="Current price date(mm/dd/yyyy)"
                        errText={errors.cpDate}
                        validation={errors?.cpDate && touched?.cpDate}
                        passValue={moment(
                          otherAssetsData?.current_price_date
                        ).format("L")}
                        isShowFutureDates={true}
                        isReadOnly={true}
                      />
                    </div>
                    <div className="-mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                      {banksData?.length > 0 ? (
                        <BrokerageSelect
                          data={banksData}
                          placeholder={"Link bank account (Optional)"}
                          setId={setBankId}
                          passId={otherAssetsData?.bank_account?.id}
                          passOpt={getPassedBankAccount()}
                          // passOpt={otherAssetsData?.bank_account?.bank_name?.name}
                          dataLength={banksData?.length}
                        />
                      ) : (
                        loadingDummyInput("Link bank account (Optional)")
                      )}
                    </div>

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-0 mt-[50px] W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton typeText={"submit"} disabled={isButtonDisabled}>UPDATE</AssetButton>
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

export default EditOtherAssets;
