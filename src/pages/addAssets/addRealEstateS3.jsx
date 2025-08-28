/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import AssetInput from "../../components/addAssets/assetInput";
import AssetSelect from "../../components/addAssets/assestSelect";
import AssetDatePickerInput from "../../components/addAssets/assetDatePicker";
import AssetPriceInput from "../../components/addAssets/priceInput";
import AssetFeetInput from "../../components/addAssets/assetFeetInput";
import LoadingButton from "../../components/auth/LoadingButton";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import AssetButton from "../../components/addAssets/assetButton";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChooseLoanTypeModal from "./chooseLoanTypeModal";
import SelectBankAccountModal from "./selectBankAccountModal";
import AddAssetsSuccessModal from "./addAssetsSuccessModal";
import DummySelect from "../../components/common/dummyInput";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import LinkMortageSelect from "../../components/addAssets/linkMortageSelect";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddRealEstateCurrency,
  selectedAddRealEstateCurrency,
  selectedAddRealEstateCurrencyId,
  setAddRealEstateCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import moment from "moment/moment";
import {
  setDebtRoute1,
  debtRoute1Value,
  setDebtRoute2,
  debtRoute2Value,
} from "../../redux/store/slice/addFinancialsSlice";

import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

const getFormValuesData = () => {
  const formData = localStorage.getItem("formData3");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const getFormValuesData1 = () => {
  const formData = localStorage.getItem("formData1");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const getFormValuesData2 = () => {
  const formData = localStorage.getItem("formData2");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

import { setAddDebtFormData } from "../../redux/store/slice/addFinancialsSlice";

const dummyCurrencyData = [
  {
    id: 21,
    type: "currency",
    subType: "currency",
    option: "USD",
    isActive: true,
  },
  {
    id: 22,
    type: "currency",
    subType: "currency",
    option: "EUR",
    isActive: true,
  },
];

const AddRealEstateS3 = () => {
  const [formValue, setFormValue] = useState({});
  // const [getFormData,setGetFormData] = useState(getFormValuesData())
  const [formData, setFormValues] = useState(getFormValuesData());
  const [formData1, setFormData1] = useState(getFormValuesData1());
  const [formData2, setFormData2] = useState(getFormValuesData2());
  const [loanDataById, setLoanDataById] = useState();

  const [loading, setLoading] = useState(false);
  const [mortgageOpt, setMortgageOpt] = useState(null);
  const [successModalOpen1, setsuccessModalOpen1] = useState(false);
  const [successModalOpen2, setsuccessModalOpen2] = useState(false);
  const [successModalOpen, setsuccessModalOpen] = useState(false);
  const [linkMortOptions, setLinkMortOptions] = useState({});
  const [banksData, setBanksData] = useState([]);
  const [loanTypeData, setLoanTypeData] = useState([]);
  const [purchasePrice, setPurchasePrice] = useState("");
  const [loanBankName, setLoanBankName] = useState("");
  const [loanId, setLoanId] = useState(null);
  const [linkMortText, setLinkMortText] = useState("");
  const [brokerageData, setBrokerageData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [brokerageId, setBrokeragId] = useState(null);
  const location = useLocation();

  const modOPen = location?.state?.openModal;

  const [currencyData, setCurrencyData] = useState([]);
  const dispatch = useDispatch();
  const selectedRCurrency = useSelector(selectedAddRealEstateCurrency);
  const selectedRCurrencyId = useSelector(selectedAddRealEstateCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const debtRouteValue2 = useSelector(debtRoute2Value);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const navigate = useNavigate();
  const linkMortId = location?.state?.linkMortageId;

  const options = [
    { id: 0, name: "" },
    { id: 1, name: "No debt" },
    { id: 2, name: "Loan already created" },
    { id: 3, name: " Loan does not exist" },
  ];

  useEffect(() => {
    localStorage.removeItem("debtDropdownData2");
    dispatch(setAddDebtFormData({}));
  });

  useEffect(() => {
    if (linkMortId) {
      getLoanById(linkMortId);
    }
  }, [linkMortId]);

  useEffect(() => {
    localStorage.setItem("formData3", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    getRealEstateData();
    getBanks();
    // getLoanTypeData()
    // getCurrencyData();
    getLoanData();
  }, []);

  useEffect(() => {
    getBrokerageAccountDetails();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currApiSuccCond) {
      dispatch(fetchCurrencyOptionsApi(token));
    }
  }, []);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/addrealestate3" } });
    }
  }, [brokerageId]);

  const getLoanById = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}loan/${id}?desiredCurrency=${selectedRCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoanDataById(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBrokerageAccountDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selectedRCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data?.data;
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
      const length = response?.data?.data?.length;
      setbankDataLength(length + 1);
      const newObj = {
        id: length + 1,
        bank_name: { name: "Add new bank account" },
      };
      const banksData = [...data, newObj];
      setBrokerageData(banksData);
    } catch (error) {
      console.log(error.message);
    }
  };

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

  const getLoanTypeData = async () => {
    const token = localStorage.getItem("token");
    try {
      const LoanTypeResponse = await axios.get(
        `${baseUrl}options?type=loanType&subtype=loanType`,
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

  const getLoanData = async () => {
    const token = localStorage.getItem("token");
    try {
      const LoanTypeResponse = await axios.get(
        `${baseUrl}loan/asset/not-linked`,
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

  const getRealEstateData = async () => {
    const token = localStorage.getItem("token");
    try {
      const RealEstateResponse = await axios.get(
        `${baseUrl}real-estate?desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLinkMortOptions(RealEstateResponse?.data?.data[0]?.link_mortgage);
    } catch (error) {
      console.log(error.message);
    }
  };

  const initialValues = {
    purPrice: formData.purPrice || null,
    surArea: formData.surArea || null,
    PurDate: formData.PurDate || "",
    cPeriod: formData.cPeriod || null,
    ohCost: formData.ohCost || null,
    ecValue: formData.ecValue || null,
  };

  const assetValidationSchema = Yup.object({
    purPrice: Yup.string().required("Purchase price is required"),
    surArea: Yup.string().required("Surface area is required"),

    PurDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    // cPeriod: Yup.string().required("construction period is required"),
    // ohCost: Yup.string().required("Overhead cost is required"),
    // rent: Yup.string().required("Rent is required"),
    // ecValue: Yup.string().required("Estimate current value is required"),
  });

  useEffect(() => {
    if (modOPen) {
      setsuccessModalOpen(true);
    }
  }, []);

  const getLoanIdForLinkMortgage = () => {
    if (mortgageOpt === 1) {
      return null;
    } else if (loanDataById?.id) {
      return loanDataById?.id;
    } else if (loanId) {
      return loanId;
    } else {
      return null;
    }
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}real-estate`,
        {
          country: formData1?.countryId,
          address_line1: formData1?.address1,
          address_line2: formData1?.address2,
          postal_code: formData1?.postCode.toString(),
          description: formData2?.description,
          kind: formData2?.kind,
          category: formData2?.category,
          purchase_price: values?.purPrice,
          purchase_price_currency: selectedCurrencyId,
          purchase_date: moment(values?.PurDate).format("YYYY-MM-DD"),
          surface_area: values?.surArea,
          construction_period: values?.cPeriod,
          loan: getLoanIdForLinkMortgage(),
          overhead_cost: values?.ohCost,
          overhead_currency: selectedCurrencyId,
          // "rent": values?.rent,
          rent_currency: selectedCurrencyId,
          estimate_current_value: values?.ecValue,
          estimate_currency: selectedCurrencyId,
          currency: selectedRCurrencyId,
          bank_account:brokerageId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      localStorage.removeItem("formData1");
      localStorage.removeItem("formData2");
      localStorage.removeItem("formData3");
      localStorage.removeItem("realDropDownData");
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
      if (error.response.data.message === "Validation failed") {
      error.response.data.data.forEach((error) => {
        toast.error(error.message);
      });
    }
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

  // const getSelectedOpt = (optId) => {
  //   console.log(optId, "opt");
  //   setMortgageOpt(optId);
  //   if (optId === 1) {
  //     setsuccessModalOpen1(true);
  //   } else if (optId === 2) {
  //     setsuccessModalOpen2(true);
  //   }
  //   else if (optId === 3) {
  //     navigate('/adddebt',{ state: { debtRoute:'/addrealestate3' } })
  //   }
  // };

  const getSelectedOpt = (optId) => {
    setMortgageOpt(optId);
    if (optId === 2) {
      setsuccessModalOpen1(true);
    } else if (optId === 3) {
      dispatch(setDebtRoute1("/addrealestate3"));
      dispatch(setDebtRoute2("/addrealestate3"));
      navigate("/adddebt-realestate", {
        state: { debtRoute: "/addrealestate3" },
      });
    }
  };

  const closeSuccessModal1 = () => {
    setsuccessModalOpen1(false);
  };

  const closeSuccessModal2 = () => {
    setsuccessModalOpen2(false);
  };

  const handleFileUploadModal = async () => {
    setsuccessModalOpen(true);
  };

  const closeSuccessModal = () => {
    setsuccessModalOpen(false);
    navigate({ state: { openModal: false } });
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setAddRealEstateCurrency(currency.option));
    dispatch(setAddRealEstateCurrencyId(currency.id));
  };

  const getLoanName2 = () => {
    const accountNumber =
      loanDataById?.bank_account?.account_number?.toString();
    let modifiedName = "";
    if (accountNumber?.length >= 4) {
      const lastFourDigits = accountNumber?.slice(-4);
      const hiddenDigits = "*".repeat(accountNumber.length - 4);
      modifiedName = `${loanDataById?.bank_account?.bank_name?.name}( ${hiddenDigits}${lastFourDigits} )`;
    } else {
      modifiedName = `${loanDataById?.bank_account?.bank_name?.name}( ${accountNumber} )`;
    }
    return modifiedName;
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const { PurDate } = formData;
  const purchaseDate = PurDate ? moment(PurDate).format("L") : "";
  return (
    <AssetLayout
      heading={"Real Estate"}
      backRoute={"/addrealestate2"}
      closeRoute={"/addAssets"}
      isRealEstate={true}
      barWidth={"3/3"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[40px]">
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
                    <div
                      className={`mt-[0px] mb-0 w-[100%] sm:w-[47%] ${
                        successModalOpen1 && "z-0"
                      }`}
                    >
                      <AssetPriceInput
                        labelText="Purchase price"
                        idText="purPrice"
                        name="purPrice"
                        htmlForText="purPrice"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.purPrice}
                        validation={errors?.purPrice && touched?.purPrice}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedRCurrency}
                        setFormValues={setFormValues}
                        passValue={formData?.purPrice}
                        isSetFormValues={true}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[0px] mb-[4rem] w-[100%] sm:w-[47%]">
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
                    <div className="-mt-[25px] mb-0 w-[100%] sm:w-[47%] z-0">
                      <AssetFeetInput
                        labelText="Surface Area"
                        idText="surArea"
                        name="surArea"
                        htmlForText="surArea"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.surArea}
                        validation={errors?.surArea && touched?.surArea}
                        setFormValues={setFormValues}
                        passValue={formData?.surArea}
                        isSetFormValues={true}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:-mt-[25px] mb-0 w-[100%] sm:w-[47%] z-0">
                      <AssetInput
                        labelText="Construction period(Optional)"
                        idText="cPeriod"
                        name="cPeriod"
                        htmlForText="cPeriod"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.cPeriod}
                        setFormValues={setFormValues}
                        passValue={formData?.cPeriod}
                        isSetFormValues={true}
                        shouldPreventKeys={true}
                        //   validation={errors?.cPeriod && touched?.cPeriod}

                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[32px] mb-0 w-[100%] sm:w-[47%]">
                      <LinkMortageSelect
                        data={options}
                        placeholder={"Link mortgage"}
                        getSelectedOpt={getSelectedOpt}
                        setFormValues={setFormValues}
                        loanName={loanBankName}
                        // loanName2={loanDataById?.bank_account?.bank_name?.name}
                        loanName2={
                          loanDataById !== undefined ? getLoanName2() : ""
                        }
                        setText={setLinkMortText}
                      />
                    </div>
                    <div className="mt-[20px] sm:mt-[24px] mb-0 w-[100%] sm:w-[47%] z-0">
                      <AssetPriceInput
                        labelText="Overhead cost(Optional)"
                        idText="ohCost"
                        name="ohCost"
                        htmlForText="ohCost"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.ohCost}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedRCurrency}
                        setFormValues={setFormValues}
                        passValue={formData?.ohCost}
                        isSetFormValues={true}
                        shouldPreventKeys={true}
                        //   validation={errors?.ohCost && touched?.ohCost}
                      />
                    </div>
                    {/* <div className="mt-[24px] sm:mt-[18px] mb-0 w-[100%] sm:w-[47%] z-0">
                      <AssetPriceInput
                        labelText="Rent"
                        idText="rent"
                        name="rent"
                        htmlForText="rent"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.rent}
                        validation={errors?.rent && touched?.rent}
                        curData={currencyData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedCurrency}
                        setFormValues={setFormValues}
                        passValue={formData?.rent}
                        isSetFormValues = {true}
                      />
                    </div> */}
                    <div className="mt-[24px] sm:mt-[18px] mb-0 w-[100%] sm:w-[47%] z-0">
                      <AssetPriceInput
                        labelText="Estimate current value(Optional)"
                        idText="ecValue"
                        name="ecValue"
                        htmlForText="ecValue"
                        typeText="number"
                        placeHolderText=""
                        // errText={errors.ecValue}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedRCurrency}
                        setFormValues={setFormValues}
                        passValue={formData?.ecValue}
                        isSetFormValues={true}
                        // validation={errors?.ecValue && touched?.ecValue}
                        shouldPreventKeys={true}
                      />
                    </div>

                    <div className="mt-[32px] sm:mt-[26px] w-[100%] sm:w-[47%]">
                      {brokerageData?.length > 0 ? (
                        <BrokerageSelect
                          data={brokerageData}
                          placeholder={"Brokerage account"}
                          setId={setBrokeragId}
                          dataLength={brokerageData?.length}
                        />
                      ) : (
                        loadingDummyInput("Brokerage account")
                      )}
                    </div>

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-3 mt-[112px]  W-[150px] self-end z-0">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton
                        typeText={"submit"}
                        disabled={
                          errors?.surArea ||
                          // errors?.rent ||
                          formValue?.surArea?.length < 1 ||
                          // formValue?.rent?.length < 1 ||
                          errors?.PurDate ||
                          formValue?.PurDate?.length < 1 ||
                          errors?.purPrice ||
                          formValue?.purPrice?.length < 1 ||
                          // errors?.ecValue ||
                          // formValue?.ecValue?.length < 1 ||
                          linkMortText === "" || brokerageId === null
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
          {successModalOpen1 && (
            <ChooseLoanTypeModal
              isSuccessModalOpen1={successModalOpen1}
              // SuccessModalopen={handleSubmit}
              handleSuccessClose1={closeSuccessModal1}
              loanTypeData={loanTypeData}
              setLoanId={setLoanId}
              setLoanBankName={setLoanBankName}
              loanId={loanId}
            />
          )}
          {successModalOpen2 && (
            <SelectBankAccountModal
              setsuccessModalOpen1={setsuccessModalOpen1}
              isSuccessModalOpen2={successModalOpen2}
              // SuccessModalopen={handleSubmit}
              handleSuccessClose2={closeSuccessModal2}
              banksData={banksData}
            />
          )}
          {modOPen ? (
            <AddAssetsSuccessModal
              isSuccessModalOpen={successModalOpen}
              textData={"Bank Account Added Successfully"}
              // textData={'Asset Added Successfully'}
              SuccessModalopen={handleFileUploadModal}
              handleSuccessClose={closeSuccessModal}
              // assetId={assetId}
            />
          ) : (
            ""
          )}
        </>
      }
    />
  );
};

export default AddRealEstateS3;
