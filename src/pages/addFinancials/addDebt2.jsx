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
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import LoanTypeSelect from "../../components/addAssets/loanTypeSelect";
import BankSelect from "../../components/addAssets/bankSelect";
import PayFrequencySelect from "../../components/addAssets/payFrequencySelect";
import DummySelect from "../../components/common/dummyInput";
import LinkToAssetSelect from "../../components/addAssets/linkToAssetSelect";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import DebtTypeSelect from "../../components/addAssets/debtTypeSelect";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";

import {
  setAddDebtCurrency,
  selectedAddDebtCurrency,
  selectedAddDebtCurrencyId,
  setAddDebtCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import {
  setDebtRoute1,
  debtRoute1Value,
  setDebtRoute2,
  debtRoute2Value,
} from "../../redux/store/slice/addFinancialsSlice";

import {
  setAddDebtFormData,
  addedDebtFormData,
} from "../../redux/store/slice/addFinancialsSlice";

const getDebtDropDownData = (num) => {
  const data = localStorage.getItem("debtDropdownData2");
  if (data !== null && data !== undefined) {
    const dataa = JSON.parse(data);
    if (num === 1) {
      return dataa.loanId;
    } else if (num === 2) {
      return dataa.loanText;
    } else if (num === 3) {
      return dataa.payFreqId;
    } else if (num === 4) {
      return dataa.payFreqText;
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
    }
  }
};

const AddDebtRealEstate = () => {
  const [formValue, setFormValue] = useState();
  const [formData, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [loanTypeData, setLoanTypeData] = useState([]);
  const [banksData, setBanksData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [paymentFrequencyData, setPaymentFrequencyData] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState();
  const [bankId, setBankId] = useState(1);
  const [loanId, setLoanId] = useState(getDebtDropDownData(1));
  const [loanText, setLoanText] = useState(getDebtDropDownData(2));
  const [loanName, setLoanName] = useState();

  const [payFreqId, setPayFreqId] = useState(getDebtDropDownData(3));
  const [payFreqText, setPayFreqText] = useState(getDebtDropDownData(4));

  const [linkToAssetData, setLinkToAssetData] = useState([]);
  const [linkToAssetId, setLinkToAssetId] = useState();
  const [linkAssetType, setLinkAssetType] = useState();
  const dispatch = useDispatch();
  const addDebtFormData = useSelector(addedDebtFormData);

  const navigate = useNavigate();
  const location = useLocation();
  const addDebtRoute = location?.state?.debtRoute;

  const debtRouteValue = useSelector(debtRoute1Value);
  const debtRouteValue2 = useSelector(debtRoute2Value);

  const selectedAddDebCurrency = useSelector(selectedAddDebtCurrency);
  const selectedAddDebCurrencyId = useSelector(selectedAddDebtCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const options = [
    { id: 1, name: "Mortgage" },
    { id: 2, name: "Student loan" },
    { id: 3, name: "Personal loan" },
  ];

  useEffect(() => {
    const data = { ...formData, loanId: loanId, loanName: loanName };
    dispatch(setAddDebtFormData(data));
    // localStorage.setItem("formDatadebt", JSON.stringify(data));
  }, [formData, loanId, loanName]);

  useEffect(() => {
    const data = {
      loanId: loanId,
      loanText: loanText,
      payFreqId: payFreqId,
      payFreqText: payFreqText,
    };
    localStorage.setItem("debtDropdownData2", JSON.stringify(data));
  }, [loanId, payFreqId]);

  useEffect(() => {
    getLoanTypeData();
    getBanks();
    getPaymentFrequency();
    getLinkToAsset();
  }, []);

  useEffect(() => {
    if (bankId === bankDataLength) {
      navigate("/addbankaccount2", {
        state: { addBankRoute: "/adddebt-realestate" },
      });
    }
  }, [bankId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currApiSuccCond) {
      dispatch(fetchCurrencyOptionsApi(token));
    }
  }, []);

  const getLinkToAsset = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}user-assets/name`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const resData = response?.data?.data;
      const realEstate = resData.filter((item) => item.type === "realEstate");
      setLinkToAssetData(realEstate);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSelectedOpt = (optId) => {
    setSelectedOpt(optId);
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
        `${baseUrl}bank-account?desiredCurrency=${selectedAddDebCurrencyId}`,
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

  const getLoanTypeData = async () => {
    const token = localStorage.getItem("token");
    try {
      const LoanTypeResponse = await axios.get(
        `${baseUrl}lists?type=loanType&subtype=loanType`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoanTypeData(LoanTypeResponse?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const initialValues = {
    priAmount: "",
    stDate: "",
    // bName:"",
    intRate: "",
    loanTerm: "",
  };

  const assetValidationSchema = Yup.object({
    priAmount: Yup.string().required("Principal amount is required"),
    intRate: Yup.string().required("Interest rate is required"),
    // linkAsset: Yup.string().required("Link asset is required"),
    // bName: Yup.string().required("Bank name is required"),
    loanTerm: Yup.string().required("Loan term is required"),

    stDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}loan`,
        {
          loan_type: loanId,
          interest_rate: values?.intRate,
          payment_frequency: payFreqId,
          loan_term: values?.loanTerm,
          principal_amount: values?.priAmount,
          currency: selectedAddDebCurrencyId,
          bank_account: bankId,
          start_date: moment(values?.stDate).format("YYYY-MM-DD"),
          // "link_realEstate":linkToAssetId
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
          : "Successfully add loan details";
      setLoading(false);
      toast.success(successMessage);
      setTimeout(() => {
        navigateToAddrealEstate3(response?.data?.data?.id);
      }, 3000);
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

  const navigateToAddrealEstate3 = (id) => {
    if (debtRouteValue2 === "/addrealestate3") {
      navigate("/addrealestate3", { state: { linkMortageId: id } });
    } else if (debtRouteValue2 === "/editrealestate3") {
      navigate("/editrealestate3", { state: { linkMortageId: id } });
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
    dispatch(setAddDebtCurrency(currency.option));
    dispatch(setAddDebtCurrencyId(currency.id));
  };

  const { stDate } = addDebtFormData;
  const startDate = stDate ? moment(stDate).format("L") : "";

  return (
    <AssetLayout
      heading={"Debt"}
      backRoute={debtRouteValue}
      closeRoute={debtRouteValue}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Add Debt
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={assetValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col">
                  <div className="flex flex-row justify-between flex-wrap">
                    <div className="mt-[0px] mb-0 w-[100%] sm:w-[47%]">
                      {loanTypeData?.length > 0 ? (
                        <DebtTypeSelect
                          data={loanTypeData}
                          placeholder={"Debt type"}
                          // getSelectedOpt={getSelectedOpt}
                          setLoanId={setLoanId}
                          setLoanName={setLoanName}
                          setText={setLoanText}
                          passText={loanText}
                        />
                      ) : (
                        loadingDummyInput("Debt type")
                      )}
                    </div>
                    <div className="mt-[20px] sm:-mt-[9px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Principal amount"
                        idText="priAmount"
                        name="priAmount"
                        htmlForText="priAmount"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.priAmount}
                        validation={errors?.priAmount && touched?.priAmount}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        passValue={addDebtFormData?.priAmount}
                        isSetFormValues={true}
                        curData={currencyOptionsData}
                        selectedCurrency={selectedAddDebCurrency}
                        settingCurrency={setAddStcksCurr}
                        // setFormValues={setFormValues}
                      />
                    </div>

                    <div className="mt-[20px] sm:mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Interest rate(%)"
                        idText="intRate"
                        name="intRate"
                        htmlForText="intRate"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.intRate}
                        validation={errors?.intRate && touched?.intRate}
                        password={false}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        passValue={addDebtFormData?.intRate}
                        isSetFormValues={true}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[20px] sm:mt-[28px] mb-0 w-[100%] sm:w-[47%]">
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
                    <div className="mt-[34px] mb-0 w-[100%] sm:w-[47%]">
                      {paymentFrequencyData?.length > 0 ? (
                        <PayFrequencySelect
                          data={paymentFrequencyData}
                          placeholder={"Payment frequency"}
                          setId={setPayFreqId}
                          setText={setPayFreqText}
                          passText={payFreqText}
                        />
                      ) : (
                        loadingDummyInput("Payment frequency")
                      )}
                    </div>
                    <div className="mt-[20px] sm:mt-[26px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="stDate"
                        label="Start date(mm/dd/yyyy)"
                        errText={errors.stDate}
                        validation={errors?.stDate && touched?.stDate}
                        setFormValues={setFormValues}
                        passValue={startDate}
                        isSetFormValues={true}
                      />
                    </div>

                    <div className="-mt-[24px] sm:-mt-[32px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Loan term(Number of Months)"
                        idText="loanTerm"
                        name="loanTerm"
                        htmlForText="loanTerm"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.loanTerm}
                        validation={errors?.loanTerm && touched?.loanTerm}
                        password={false}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        passValue={addDebtFormData?.loanTerm}
                        isSetFormValues={true}
                        // profileSettings={true}
                      />
                    </div>
                    {/* <div className="mt-[24px] sm:-mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                     {linkToAssetData?.length >= 0 ? (
                      <LinkToAssetSelect
                        data={linkToAssetData}
                        placeholder={"Link to Asset"}
                        setId={setLinkToAssetId}
                        setType={setLinkAssetType}
                      />
                    ):loadingDummyInput('Link to Asset')}
                  </div> */}

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-3 mt-[48px] W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton
                        typeText={"submit"}
                        disabled={
                          errors?.priAmount ||
                          errors?.intRate ||
                          formValue?.priAmount?.length < 1 ||
                          formValue?.intRate?.length < 1 ||
                          errors?.stDate ||
                          formValue?.stDate?.length < 1 ||
                          errors?.loanTerm ||
                          formValue?.loanTerm?.length < 1 ||
                          loanId === null ||
                          payFreqId === null
                        }
                        //  onClick={navigateToAddrealEstate3}
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

export default AddDebtRealEstate;
