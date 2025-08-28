/* eslint-disable react-hooks/exhaustive-deps */
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
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import LinkMortageSelect from "../../components/addAssets/linkMortageSelect";
import EditChooseLoanTypeModal from "../addAssets/editChooseLoanTypeModal";
import EditSelectBankAccountModal from "../addAssets/editSelectBankAccountModal";
import DummySelect from "../../components/common/dummyInput";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditRealEstateCurrency,
  selectedEditRealEstateCurrency,
  selecteEditRealEstateCurrencyId,
  setEditRealEstateCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import {
  setRealEstateName,
  selectedRealEstateName,
} from "../../redux/store/slice/portfolioSlice";
import {
  setDebtRoute1,
  debtRoute1Value,
  setDebtRoute2,
  debtRoute2Value,
} from "../../redux/store/slice/addFinancialsSlice";

const EditRealEstateS3 = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [realEstateData, setRealEstateData] = useState();
  const [mortgageOpt, setMortgageOpt] = useState();
  const [successModalOpen1, setsuccessModalOpen1] = useState(false);
  const [successModalOpen2, setsuccessModalOpen2] = useState(false);
  const [loanTypeData, setLoanTypeData] = useState([]);
  const [banksData, setBanksData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [bankId, setBankId] = useState(null);
  const [currencyData, setCurrencyData] = useState([]);
  const [loanId, setLoanId] = useState(null);
  const [loanBankName, setLoanBankName] = useState("");
  const [loanDataById, setLoanDataById] = useState();
  const [text, setText] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedEditRealEstateCurrency);
  const selecteddCurrencyId = useSelector(selecteEditRealEstateCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedRealEstName = useSelector(selectedRealEstateName);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const debtRouteValue1 = useSelector(debtRoute1Value);
  const debtRouteValue2 = useSelector(debtRoute2Value);

  const navigate = useNavigate();
  const location = useLocation();
  // const editId =  location?.state?.editId;
  const editId = localStorage.getItem("editid");
  const linkMortId = location?.state?.linkMortageId;
  // const assetName = location?.state?.editName

  const linMortOptions = [
    { id: 0, name: "" },
    { id: 1, name: "Connection already exists" },
    { id: 2, name: "Create a connection with new bank" },
    { id: 3, name: "Can connect with bank doesnot exist" },
  ];

  const options = [
    { id: 0, name: "" },
    { id: 1, name: "No debt" },
    { id: 2, name: "Loan already created" },
    { id: 3, name: " Loan does not exist" },
  ];

  useEffect(() => {
    if (linkMortId) {
      getLoanById(linkMortId);
    }
  }, [linkMortId]);

  useEffect(() => {
    getRealEstateDataById();
  }, [dataUpdated, setDataUpdated]);

  useEffect(() => {
    if (bankId === bankDataLength) {
      navigate("/addbankaccount2", {
        state: { addBankRoute: "/editrealestate3" },
      });
    }
  }, [bankId]);

  useEffect(() => {
    getBanks();
    getLoanTypeData();
    // getCurrencyData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currApiSuccCond) {
      dispatch(fetchCurrencyOptionsApi(token));
    }
  }, []);

  const getLoanById = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}loan/${id}?desiredCurrency=${selecteddCurrencyId}`,
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

  // const getLoanTypeData = async () =>{
  //   const token = localStorage.getItem("token");
  //    try{
  //       const LoanTypeResponse = await axios.get(
  //         `${baseUrl}options?type=loanType&subtype=loanType`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       setLoanTypeData(LoanTypeResponse?.data?.data)
  //    }catch(error){
  //     console.log(error.message)
  //    }
  // }

  const getLoanTypeData = async () => {
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
      const banksResponse = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selecteddCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = banksResponse?.data?.data;
      data.forEach((item) => {
        const accountNumber = item.account_number.toString(); // Convert account number to string
        const lastFourDigits = accountNumber.slice(-4); // Get last four digits
        const hiddenDigits = "*".repeat(accountNumber.length - 4); // Create string of asterisks for hidden digits
        const modifiedName = `${item.bank_name.name}( ${hiddenDigits}${lastFourDigits} )`; // Concatenate modified name
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

  const initialValues = {
    purPrice: null,
    surArea: null,
    PurDate: "",
    cPeriod: null,
    ohCost: null,
    rent: null,
    ecValue: null,
    linkMort: null,
  };

  const assetValidationSchema = Yup.object({
    purPrice: Yup.string().required("Purchase is required"),
    surArea: Yup.string().required("Surface is required"),
    linkMort: Yup.string().required("Link mortgage is required"),

    PurDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    cPeriod: Yup.string().required("construction period is required"),
    ohCost: Yup.string().required("Overhead is required"),
    rent: Yup.string().required("rent is required"),
    // ecValue: Yup.string().required("estimated current is required"),
  });

  const getDateString = (date) => {
    const d = new Date(date);
    const isoDate = moment(d.toISOString()).format("YYYY-MM-DD");
    return isoDate;
  };

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
    setIsButtonDisabled(true);
    try {
      const response = await axios.put(
        `${baseUrl}real-estate/${editId}`,
        {
          purchase_price: values?.purPrice,
          purchase_price_currency: selecteddCurrencyId,
          // "purchase_date": values?.PurDate,
          purchase_date: getDateString(values?.PurDate),
          surface_area: values?.surArea,
          construction_period: values?.cPeriod,
          loan: getLoanIdForLinkMortgage(),
          overhead_cost: values?.ohCost,
          overhead_currency: selecteddCurrencyId,
          // "rent": values?.rent,
          rent_currency: selecteddCurrencyId,
          // estimate_current_value: values?.ecValue,
          estimate_currency: selecteddCurrencyId,
          currency: selecteddCurrencyId,
           bank_account:bankId
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
        navigate("/realestate");
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

  // const getSelectedOpt = (optId) => {
  //   console.log(optId, "opt");
  //   setMortgageOpt(optId);
  //   if (optId === 1) {
  //     setsuccessModalOpen1(true);
  //   } else if (optId === 2) {
  //     setsuccessModalOpen2(true);
  //   }
  //   else if (optId === 3) {
  //     navigate('/adddebt')
  //   }

  // };

  const getSelectedOpt = (optId) => {
    setMortgageOpt(optId);
    if (optId === 2) {
      setsuccessModalOpen1(true);
    } else if (optId === 3) {
      dispatch(setDebtRoute1("/editrealestate3"));
      dispatch(setDebtRoute2("/editrealestate3"));
      navigate("/adddebt-realestate", {
        state: { debtRoute: "/editrealestate3" },
      });
    }
  };

  const closeSuccessModal1 = () => {
    setsuccessModalOpen1(false);
  };

  const closeSuccessModal2 = () => {
    setsuccessModalOpen2(false);
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const getLinkMortBank = () => {
    if (realEstateData?.link_mortgage) {
      const accountNumber =
        realEstateData?.link_mortgage?.bank_account?.account_number.toString();
      let modifiedName = "";
      if (accountNumber?.length >= 4) {
        const lastFourDigits = accountNumber?.slice(-4);
        const hiddenDigits = "*".repeat(accountNumber?.length - 4);
        modifiedName = `${realEstateData?.link_mortgage?.bank_account?.bank_name?.name}( ${hiddenDigits}${lastFourDigits} )`;
      } else {
        modifiedName = `${realEstateData?.link_mortgage?.bank_account?.bank_name?.name}( ${accountNumber} )`;
      }
      return modifiedName;
    }
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setEditRealEstateCurrency(currency.option));
    dispatch(setEditRealEstateCurrencyId(currency.id));
  };

  const getPassedBankAccount = () => {
    console.log("realEstateData", realEstateData);
    const bankName = realEstateData?.bank_account?.bank_name?.name;
    const accNo = realEstateData?.bank_account?.account_number;

    if (bankName && accNo) {
      const accNum = accNo.toString();
      const lastFourDigits = accNum?.slice(-4);

      const maskedAccNo = "*".repeat(accNum?.length - 4) + lastFourDigits;

      const concatenated = `${bankName} ( ${maskedAccNo}) `;

      return concatenated;
    }

    return null;
  };


  return (
    <AssetLayout
      heading={selectedRealEstName}
      backRoute={"/editrealestate2"}
      closeRoute={"/realestate"}
      isRealEstate={true}
      barWidth={"3/3"}
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
                        passValue={realEstateData?.purchase_price}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[0px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="PurDate"
                        label="Purchase date(mm/dd/yyyy)"
                        errText={errors.PurDate}
                        validation={errors?.PurDate && touched?.PurDate}
                        passValue={moment(realEstateData?.purchase_date).format(
                          "L"
                        )}
                        isShowFutureDates={true}
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
                        passValue={realEstateData?.surface_area}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:-mt-[25px] mb-0 w-[100%] sm:w-[47%] z-0">
                      <AssetInput
                        labelText="Construction period"
                        idText="cPeriod"
                        name="cPeriod"
                        htmlForText="cPeriod"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.cPeriod}
                        validation={errors?.cPeriod && touched?.cPeriod}
                        passValue={realEstateData?.construction_period || 1}
                        shouldPreventKeys={true}
                        // profileSettings={true}
                      />
                    </div>

                    <div className="mt-[32px] sm:mt-[28px] mb-0 w-[100%] sm:w-[47%]">
                      <LinkMortageSelect
                        data={options}
                        placeholder={"Link mortgage"}
                        getSelectedOpt={getSelectedOpt}
                        // setFormValues={setFormValues}
                        loanName={loanBankName}
                        loanName2={loanDataById?.bank_account?.bank_name?.name}
                        passValue={getLinkMortBank()}
                        // passValue={
                        //   realEstateData?.link_mortgage?.bank_account?.bank_name
                        //     ?.name
                        // }
                        isEditRealEstate={true}
                        setText={setText}
                      />
                    </div>
                    <div className="mt-[30px] sm:mt-[20px] mb-0 w-[100%] sm:w-[47%] z-0">
                      <AssetPriceInput
                        labelText="Overhead cost"
                        idText="ohCost"
                        name="ohCost"
                        htmlForText="ohCost"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.ohCost}
                        validation={errors?.ohCost && touched?.ohCost}
                        passValue={realEstateData?.overhead_cost}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[32px] mb-0 w-[100%] sm:w-[47%]">
                  {banksData?.length > 0 ? (
                        <BrokerageSelect
                          data={banksData}
                          placeholder={"Brokerage account"}
                          setId={setBankId}
                          passId={realEstateData?.bank_account?.id}
                          dataLength={banksData?.length}
                          passOpt={getPassedBankAccount()}
                          //passOpt={stocksData?.}
                        />
                      ):(loadingDummyInput('Bank account exists'))}
                  </div> 
                    {/* <div className="mt-[20px] sm:mt-[24px] mb-0 w-[100%] sm:w-[47%] z-0">
                      <AssetPriceInput
                        labelText="Estimate current value"
                        idText="ecValue"
                        name="ecValue"
                        htmlForText="ecValue"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.ecValue}
                        validation={errors?.ecValue && touched?.ecValue}
                        passValue={realEstateData?.estimate_current_value}
                        curData={currencyData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedCurrency}
                        shouldPreventKeys={true}
                      />
                    </div> */}

                    {/* <div className="mt-[30px] sm:mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                  <AssetPriceInput
                      labelText="Rent"
                      idText="rent"
                      name="rent"
                      htmlForText="rent"
                      typeText="number"
                      placeHolderText=""
                      errText={errors.rent}
                      validation={errors?.rent && touched?.rent}
                      passValue={realEstateData?.rent}
                      curData={currencyData}
                      settingCurrency={setAddStcksCurr}
                      selectedCurrency={selectedCurrency}
                      shouldPreventKeys={true}
                    />
                  </div> */}

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-3 mt-10 W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton typeText={"submit"} disabled={ isButtonDisabled}>update</AssetButton>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          {successModalOpen1 && (
            <EditChooseLoanTypeModal
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
            <EditSelectBankAccountModal
              setsuccessModalOpen1={setsuccessModalOpen1}
              isSuccessModalOpen2={successModalOpen2}
              // SuccessModalopen={handleSubmit}
              handleSuccessClose2={closeSuccessModal2}
              banksData={banksData}
            />
          )}
        </>
      }
    />
  );
};

export default EditRealEstateS3;
