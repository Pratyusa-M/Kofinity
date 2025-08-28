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
import { useNavigate } from "react-router-dom";
import PayFrequencySelect from "../../components/addAssets/payFrequencySelect";
import BankSelect from "../../components/addAssets/bankSelect";
import PeriodicitySelect from "../../components/addAssets/periodicitySelect";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import DummySelect from "../../components/common/dummyInput";
import LinkToAssetSelect from "../../components/addAssets/linkToAssetSelect";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddExpenseCurrency,
  selectedAddExpenseCurrency,
  selectedAddExpenseCurrencyId,
  setAddDExpenseCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import moment from "moment/moment";

const getFormValuesData = () => {
  const formData = localStorage.getItem("expenseFormData");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const getExpenseDropDownData = (num) => {
  const data = localStorage.getItem("expenseDropdownData");
  if (data !== null && data !== undefined) {
    const dataa = JSON.parse(data);
    if (num === 1) {
      return dataa.transactionId;
    } else if (num === 2) {
      return dataa.transactionText;
    } else if (num === 3) {
      return dataa.payFreqId;
    } else if (num === 4) {
      return dataa.payFreqText;
    } else if (num === 5) {
      return dataa.periodId;
    } else if (num === 6) {
      return dataa.periodText;
    } else if (num === 7) {
      return dataa.linkToAssetId;
    } else if (num === 8) {
      return dataa.linkAssetType;
    } else if (num === 9) {
      return dataa.assetText;
    }
  } else {
    if (num === 1) {
      return null;
    } else if (num === 2) {
      return "";
    } else if (num === 3) {
      return null;
    } else if (num === 4) {
      return "";
    } else if (num === 5) {
      return null;
    } else if (num === 6) {
      return "";
    } else if (num === 7) {
      return null;
    } else if (num === 8) {
      return "";
    } else if (num === 9) {
      return "";
    }
  }
};

const AddExpense = () => {
  const [formValue, setFormValue] = useState();
  const [formData, setFormValues] = useState(getFormValuesData());

  const [loading, setLoading] = useState(false);
  const [paymentFrequencyData, setPaymentFrequencyData] = useState([]);
  const [bankId, setBankId] = useState(null);
  const [periodId, setPeroidId] = useState(getExpenseDropDownData(5));
  const [periodText, setPeriodText] = useState(getExpenseDropDownData(6));
  const [banksData, setBanksData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [payFreqId, setPayFreqId] = useState(getExpenseDropDownData(3));
  const [payFreqText, setPayFreqText] = useState(getExpenseDropDownData(4));
  const [linkToAssetData, setLinkToAssetData] = useState([]);
  const [linkToAssetId, setLinkToAssetId] = useState(getExpenseDropDownData(7));
  const [linkAssetType, setLinkAssetType] = useState(getExpenseDropDownData(8));
  const [assetText, setAssetText] = useState(getExpenseDropDownData(9));
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [currencyData, setCurrencyData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [transactionId, setTransactionId] = useState(getExpenseDropDownData(1));
  const [transactionText, setTransactionText] = useState(
    getExpenseDropDownData(2)
  );
  const dispatch = useDispatch();

  const selectedAddExpensCurrency = useSelector(selectedAddExpenseCurrency);
  const selectedAddExpensCurrencyId = useSelector(selectedAddExpenseCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const navigate = useNavigate();

  const options = [
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
    { id: 4, name: 4 },
    { id: 5, name: 5 },
    { id: 6, name: 6 },
    { id: 7, name: 7 },
    { id: 8, name: 8 },
    { id: 9, name: 9 },
  ];

  useEffect(() => {
    const data = { ...formData };
    localStorage.setItem("expenseFormData", JSON.stringify(data));
  }, [formData]);

  useEffect(() => {
    const data = {
      transactionId: transactionId,
      transactionText: transactionText,
      payFreqId: payFreqId,
      payFreqText: payFreqText,
      periodId: periodId,
      periodText: periodText,
      linkToAssetId: linkToAssetId,
      linkAssetType: linkAssetType,
      assetText: assetText,
    };
    localStorage.setItem("expenseDropdownData", JSON.stringify(data));
  }, [transactionId, payFreqId, periodId, linkToAssetId]);

  useEffect(() => {
    getBanks();
    getPaymentFrequency();
    getLinkToAsset();
    getTransactionData();
    // getCurrencyData();
  }, []);

  useEffect(() => {
    if (bankId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/addexpense" } });
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

  const getTransactionData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}lists?type=transaction&subtype=expense`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactionData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLinkToAsset = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}user-assets/name`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLinkToAssetData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getPaymentFrequency = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}lists?type=paymentFrequency&subtype=paymentFrequency`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentFrequencyData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBanks = async () => {
    const token = localStorage.getItem("token");
    try {
      const banksResponse = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selectedAddExpensCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = banksResponse?.data?.data;
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

  const initialValues = {
    expAmount: formData.expAmount || "",
    stDate: formData.stDate || "",
    endDate: formData.endDate || "",
    noOccr: formData.noOccr || null,
    transName: formData.transName || "",
  };

  const assetValidationSchema = Yup.object({
    // expCatg: Yup.string().required("Expense category is required"),
    // noOccr: Yup.string().required("Number of occurences is required"),
    expAmount: Yup.string().required("Expense amount is required"),
    transName: Yup.string().required("Transaction name is required"),

    stDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    endDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.post(
        `${baseUrl}expense`,
        {
          // expense_category: values?.expCatg,
          transaction_name: transactionId,
          description: values?.transName,
          payment_frequency: payFreqId,
          periodicity: periodId,
          expense_amount: values.expAmount,
          currency: selectedAddExpensCurrencyId,
          associate_bank: bankId,
          start_date: moment(values?.stDate).format("YYYY-MM-DD"),
          end_date: moment(values?.endDate).format("YYYY-MM-DD"),
          no_of_occurrence: values?.noOccr,
          link_asset: linkToAssetId,
          asset_type: linkAssetType,
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
          : "Successfully add expense details";
      toast.success(successMessage);
      setLoading(false);
      setTimeout(() => {
        navigate("/pl");
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
    dispatch(setAddExpenseCurrency(currency.option));
    dispatch(setAddDExpenseCurrencyId(currency.id));
  };

  const { stDate, endDate } = formData;
  const startDate = stDate ? moment(stDate).format("L") : "";
  const enDate = endDate ? moment(endDate).format("L") : "";

  return (
    <AssetLayout
      heading={"Expense"}
      backRoute={"/addfinancial"}
      closeRoute={"/addfinancial"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Add Expense
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={assetValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col">
                  <div className="flex flex-row justify-between flex-wrap">
                    {/* <div className="mt-[0px] sm:mt-[10px] mb-0 w-[100%] sm:w-[47%]">
                      
                      {transactionData?.length > 0 ? (
                        <PayFrequencySelect
                          data={transactionData}
                          placeholder={"Transaction name"}
                          setId={setTransactionId}
                          setText={setTransactionText}
                          passText={transactionText}
                        />
                      ) : (
                        loadingDummyInput("Transaction name")
                      )}
                    </div> */}
                    <div className="-mt-[24px] sm:-mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Transaction name"
                        idText="transName"
                        name="transName"
                        htmlForText="transName"
                        typeText="text"
                        placeHolderText=""
                        errText={errors.transName}
                        validation={errors?.transName && touched?.transName}
                        password={false}
                        shouldPreventKeys={false}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.transName}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:-mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Expense amount"
                        idText="expAmount"
                        name="expAmount"
                        htmlForText="expAmount"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.expAmount}
                        validation={errors?.expAmount && touched?.expAmount}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedAddExpensCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.expAmount}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      {transactionData?.length > 0 ? (
                        <PayFrequencySelect
                          data={transactionData}
                          placeholder={"Transaction type"}
                          setId={setTransactionId}
                          setText={setTransactionText}
                          passText={transactionText}
                        />
                      ) : (
                        loadingDummyInput("Transaction type")
                      )}
                    </div>

                    <div className="mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      {paymentFrequencyData?.length > 0 ? (
                        <PayFrequencySelect
                          data={paymentFrequencyData}
                          placeholder={"Payment frequency"}
                          setId={setPayFreqId}
                          setText={setPayFreqText}
                          passText={payFreqText}
                        />
                      ) : (
                        loadingDummyInput("payment frequency")
                      )}
                    </div>
                    <div className="mt-[20px] sm:mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      {banksData?.length > 0 ? (
                        <BrokerageSelect
                          data={banksData}
                          placeholder={"Bank name"}
                          setId={setBankId}
                          dataLength={banksData?.length}
                        />
                      ) : (
                        loadingDummyInput("Bank name")
                      )}
                    </div>
                    <div className="mt-[32px] sm:mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                      <PeriodicitySelect
                        data={options}
                        placeholder={"Periodicity"}
                        setId={setPeroidId}
                        setText={setPeriodText}
                        passText={periodText}
                      />
                    </div>
                    <div className="mt-[20px] sm:mt-[12px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="stDate"
                        label="Start date(mm/dd/yyyy)"
                        errText={errors.stDate}
                        validation={errors?.stDate && touched?.stDate}
                        isShowFutureDates={true}
                        setFormValues={setFormValues}
                        passValue={startDate}
                        isSetFormValues={true}
                      />
                    </div>
                    <div className="-mt-[24px] sm:mt-[10px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="endDate"
                        label="End date(mm/dd/yyyy)"
                        errText={errors.endDate}
                        validation={errors?.endDate && touched?.endDate}
                        isShowFutureDates={true}
                        setFormValues={setFormValues}
                        passValue={enDate}
                        isSetFormValues={true}
                      />
                    </div>
                    <div className="-mt-[20px] sm:-mt-[16px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Number of occurrence(Optional)"
                        idText="noOccr"
                        name="noOccr"
                        htmlForText="noOccr"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.noOccr}
                        //   validation={errors?.noOccr && touched?.noOccr}
                        password={false}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.noOccr}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:-mt-[8px] mb-0 w-[100%] sm:w-[47%]">
                      {linkToAssetData?.length >= 0 ? (
                        <LinkToAssetSelect
                          data={linkToAssetData}
                          placeholder={"Link to Asset(Optional)"}
                          setId={setLinkToAssetId}
                          setType={setLinkAssetType}
                          setText={setAssetText}
                          passText={assetText}
                        />
                      ) : (
                        loadingDummyInput("Link to Asset")
                      )}
                    </div>

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-3 mt-[48px] W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton
                        typeText={"submit"}
                        disabled={
                          isButtonDisabled ||
                          errors?.stDate ||
                          formValue?.stDate?.length < 1 ||
                          errors?.expAmount ||
                          formValue?.expAmount?.length < 1 ||
                          errors?.endDate ||
                          formValue?.endDate?.length < 1 ||
                          // linkToAssetId === null ||
                          bankId === null
                        }
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

export default AddExpense;
