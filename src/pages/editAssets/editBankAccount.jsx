/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import AssetInput from "../../components/addAssets/assetInput";
import AssetSelect from "../../components/addAssets/assestSelect";
import AssetDatePickerWithTime from "../../components/addAssets/assetDatePickerWithTime";
import AssetPriceInput from "../../components/addAssets/priceInput";
import LoadingButton from "../../components/auth/LoadingButton";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import AssetButton from "../../components/addAssets/assetButton";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CurrentTime from "../../components/addAssets/currentTime";
import BankSelect from "../../components/addAssets/bankSelect";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import DummySelect from "../../components/common/dummyInput";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditBankCurrency,
  selectedEditBankCurrency,
  selectedEditBankCurrencyId,
  setEditBankCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

const EditBankAccount = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [accType, setAccType] = useState();
  const [dataUpdated, setDataUpdated] = useState(false);

  const [banksData, setBanksData] = useState([]);
  const [bankAccountDetails, setBankAccountDetails] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedEditBankCurrency);
  const selecteddCurrencyId = useSelector(selectedEditBankCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const navigate = useNavigate();
  const location = useLocation();

  const editId = location?.state?.editId;
  const assetName = location?.state?.editName;

  const Accoptions = [
    { id: 1, name: "savings" },
    { id: 2, name: "current" },
  ];

  useEffect(() => {
    getBanks();
    getBankAccountDetails();
    // getCurrencyData();
  }, [dataUpdated, setDataUpdated]);

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

  const getBankAccountDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}bank-account/${editId}?desiredCurrency=${selecteddCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBankAccountDetails(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBanks = async () => {
    const token = localStorage.getItem("token");
    try {
      const banksResponse = await axios.get(`${baseUrl}bank`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBanksData(banksResponse?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const initialValues = {
    bankName: null,
    accTitle: "",
    curTime: "",
    accNumber: "",
    accBal: "",
    aiRate: "",
  };

  const assetValidationSchema = Yup.object({
    bankName: Yup.string().required("bank name is required"),
    accTitle: Yup.string().required("Account Title is required"),
    currTime: Yup.string().required("Current Time Title is required"),

    curTime: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    accNumber: Yup.string().required("Account number is required"),
    accBal: Yup.string().required("Account balance is required"),
    aiRate: Yup.string().required("Annual interest rate is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.put(
        `${baseUrl}bank-account/${editId}`,
        {
          bank_name: id,
          account_type: accType,
          current_balance: values?.accBal,
          account_title: values?.accTitle,
          account_number: values?.accNumber,
          annual_interest_rate: values?.aiRate,
          // "current_time": curentTime,
          currency: selecteddCurrencyId,
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
      setDataUpdated(true);
      setLoading(false);
      setTimeout(() => {
        navigate("/bankaccount");
        setIsButtonDisabled(false);
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

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setEditBankCurrency(currency.option));
    dispatch(setEditBankCurrencyId(currency.id));
  };

  return (
    <AssetLayout
      heading={assetName}
      backRoute={"/bankaccount"}
      closeRoute={"/bankaccount"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[40px]">
              Edit Bank Account
            </h1>
            <Formik
              initialValues={initialValues}
              // validationSchema={assetValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col">
                  <div className="flex flex-row justify-between flex-wrap">
                    <div className=" mb-0 mt-2 w-[100%] sm:w-[47%]">
                      {banksData?.length > 0 ? (
                        <BankSelect
                          data={banksData}
                          placeholder={"Bank name"}
                          setId={setId}
                          passId={bankAccountDetails?.bank_name?.id}
                          passOpt={bankAccountDetails?.bank_name?.name}
                        />
                      ) : (
                        loadingDummyInput("Bank name")
                      )}
                    </div>
                    <div className="mt-[24px] sm:mt-[0px] w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Account title"
                        idText="accTitle"
                        name="accTitle"
                        htmlForText="accTitle"
                        typeText="text"
                        placeHolderText=""
                        errText={errors.accTitle}
                        validation={errors?.accTitle && touched?.accTitle}
                        password={false}
                        passValue={bankAccountDetails?.account_title}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[32px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetSelect
                        data={Accoptions}
                        placeholder={"Account type"}
                        setId={setAccType}
                        passOpt={bankAccountDetails?.account_type}
                      />
                    </div>
                    <div className="mt-[20px] sm:mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Account number"
                        idText="accNumber"
                        name="accNumber"
                        htmlForText="accNumber"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.accNumber}
                        validation={errors?.accNumber && touched?.accNumber}
                        password={false}
                        // profileSettings={true}
                        passValue={bankAccountDetails?.account_number}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[28px] sm:mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Account balance"
                        idText="accBal"
                        name="accBal"
                        htmlForText="accBal"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.accBal}
                        validation={errors?.accBal && touched?.accBal}
                        passValue={bankAccountDetails?.current_balance}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[28px] sm:mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Annual interest rate(%)"
                        idText="aiRate"
                        name="aiRate"
                        htmlForText="aiRate"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.aiRate}
                        validation={errors?.aiRate && touched?.aiRate}
                        password={false}
                        passValue={
                          bankAccountDetails?.annual_interest_rate || 1
                        }
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[28px] mb-0 w-[100%] sm:w-[47%]">
                      <CurrentTime
                        labelText="Current time(mm/dd/yyyy)"
                        idText="currTime"
                        name="currTime"
                        htmlForText="currTime"
                        typeText="text"
                        placeHolderText=""
                        errText={errors.currTime}
                        validation={errors?.currTime && touched?.currTime}
                        password={false}
                        // profileSettings={true}
                      />
                    </div>

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mt-5 mb-2 W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton typeText={"submit"} disabled={ isButtonDisabled}>UPDATE</AssetButton>
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

export default EditBankAccount;
