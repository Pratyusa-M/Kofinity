/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import AssetInput from "../../components/addAssets/assetInput";
import AssetSelect from "../../components/addAssets/assestSelect";
import AssetDatePickerInput from "../../components/addAssets/assetDatePicker";
import AssetDatePickerWithTime from "../../components/addAssets/assetDatePickerWithTime";
import AssetPriceInput from "../../components/addAssets/priceInput";
import LoadingButton from "../../components/auth/LoadingButton";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import AssetButton from "../../components/addAssets/assetButton";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CurrentTime from "../../components/addAssets/currentTime";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import format from "date-fns/format";
import BankSelect from "../../components/addAssets/bankSelect";
import DummySelect from "../../components/common/dummyInput";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddBankCurrency,
  selectedAddBankCurrency,
  selectedAddBankCurrencyId,
  setAddBankCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";

import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import moment from "moment/moment";

const getCurrentTime = () => {
  const currentDate = new Date();
  const formattedDate = moment(currentDate).format("YYYY-MM-DD");
  // "h:mm a" for time in AM/PM format, "MM/dd/yyyy" for date
  if (currentDate) {
    return formattedDate;
  } else {
    return "10:37 AM, 03/06/2024";
  }
};

const AddBankAccountP2 = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(1);
  const [accType, setAccType] = useState("savings");
  const location = useLocation();
  const [curentTime, setCurrentTime] = useState(getCurrentTime());
  // const [successModalOpen, setsuccessModalOpen] = useState(false);
  const [banksData, setBanksData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [currencyData, setCurrencyData] = useState([]);
  const dispatch = useDispatch();
  const selectedBCurrency = useSelector(selectedAddBankCurrency);
  const selectedBCurrencyId = useSelector(selectedAddBankCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);
  const navigate = useNavigate();

  const isRealEstateOpen = location?.state?.isOpenRealEstate;
  const route = location?.state?.addBankRoute;

  const Accoptions = [
    { id: 1, name: "savings" },
    { id: 2, name: "current" },
  ];

  const Bankoptions = [
    { id: 1, name: "Bank of America" },
    { id: 2, name: "Citi bank" },
  ];

  useEffect(() => {
    getBanks();
    // getCurrencyData();
  }, []);

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
    // bankName: "",
    accTitle: "",
    currTime: "",
    accNumber: "",
    accBal: "",
    aiRate: "",
    accOpen: "",
  };

  const assetValidationSchema = Yup.object({
    // bankName: Yup.string().required("bank name is required"),
    accTitle: Yup.string()
      .required("Account Title is required")
      .test(
        "isValid",
        "Account title should not consist of only numbers or special characters",
        (value) => {
          // Regular expression to check if the string consists of only numbers or special characters
          const regex = /^[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
          return !regex.test(value);
        }
      ),
    currTime: Yup.string().required("Current Time Title is required"),
    accNumber: Yup.string()
      .required("Account number is required")
      .matches(/^\d{7,20}$/, "Account number must be between 7 to 20 digits"),
    accBal: Yup.string().required("Account balance is required"),
    aiRate: Yup.string().required("Annual interest rate is required"),
    accOpen: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.post(
        `${baseUrl}bank-account`,
        {
          bank_name: id,
          account_type: accType,
          initial_balance: values?.accBal,
          account_title: values?.accTitle,
          account_number: values?.accNumber,
          annual_interest_rate: values?.aiRate,
          current_time: curentTime,
          currency: selectedBCurrencyId,
          account_opening_date:moment(values?.accOpen).format("YYYY-MM-DD")
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
          : "Successfully add bank details";
      // toast.success(successMessage);
      setLoading(false);
      OnNavigateToAddAssets();
      setTimeout(() => {
        // navigate('/addAssets')
      }, 2000);
    } catch (e) {
      console.log(e?.response?.data?.message);
      setLoading(false);
      setIsButtonDisabled(false);
       toast.error(e?.response?.data?.message || "Something went wrong");
    if (e.response.data.message === "Validation failed") {
      e.response.data.data.forEach((error) => {
        toast.error(error.message);
      });
    }
    }
  };

  const OnNavigateToAddAssets = () => {
    if (route === "/addotherassets") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        sessionStorage.setItem('otherSCode',"200")
        navigate("/addotherassets");
        // navigate("/addotherassets", {
        //   state: { sCode: 200 },
        // });
      }, 3000);
    } else if (route === "/addstocks") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/addstocks");
      }, 3000);
    } else if (route === "/adddebt") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/adddebt");
      }, 3000);
    } else if (route === "/addincome") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/addincome");
      }, 3000);
    } else if (route === "/addexpense") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/addexpense");
      }, 3000);
    } else if (route === "/addcrypto") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/addcrypto");
      }, 3000);
    } else if (route === "/editStocks") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/editStocks");
      }, 3000);
    } else if (route === "/editrealestate3") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/editrealestate3");
      }, 3000);
    } else if (route === "/editcrypto") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/editcrypto");
      }, 3000);
    } else if (route === "/editotherassets") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/editotherassets");
      }, 3000);
    } else if (route === "/buystock") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/buystock");
      }, 3000);
    } else if (route === "/adddebt-realestate") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/adddebt-realestate");
      }, 3000);
    } 
    else if (route === "/sellstock") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/sellstock");
      }, 3000);
    }
    else if (route === "/addrealestate3") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/addrealestate3");
      }, 3000);
    }
    else if (route === "/sellotherassets") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/sellotherassets");
      }, 3000);
    }
    else if (route === "/sellrealestate") {
      toast.success("Bank account added successfully");
      setTimeout(() => {
        navigate("/sellrealestate");
      }, 3000);
    }
    else {
      navigate("/addAssets", {
        state: {
          openModal: true,
          modalText: "Bank Account Added Successfully",
        },
      });
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
    dispatch(setAddBankCurrency(currency.option));
    dispatch(setAddBankCurrencyId(currency.id));
  };

  // const { PurDate } = formData;
  // const purchaseDate = PurDate ? moment(PurDate).format("L") : "";

  return (
    <AssetLayout
      heading={"BANK ACCOUNT"}
      backRoute={route}
      closeRoute={route}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[40px]">
              Add Bank Account
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={assetValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col">
                  <div className="flex flex-row justify-between flex-wrap">
                    <div className=" mt-2 mb-0 w-[100%] sm:w-[47%]">
                      {banksData?.length > 0 ? (
                        <BankSelect
                          data={banksData}
                          placeholder={"Bank name"}
                          setId={setId}
                        />
                      ) : (
                        loadingDummyInput("Bank name")
                      )}
                    </div>
                    <div className="mt-[24px] sm:mt-[0px] mb-0 w-[100%] sm:w-[47%]">
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
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[32px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetSelect
                        data={Accoptions}
                        placeholder={"Account type"}
                        setId={setAccType}
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
                        shouldPreventKeys={true}
                        // profileSettings={true}
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
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedBCurrency}
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
                        shouldPreventKeys={true}
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
                        value={""}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[28px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="accOpen"
                        label="Account Opened On(mm/dd/yyyy)"
                        errText={errors.accOpen}
                        validation={errors?.accOpen && touched?.accOpen}
                        isShowFutureDates={false}
                        shouldPreventKeys={true}
                        // setFormValues={setFormValues}
                        // passValue={PurDate}
                        // isSetFormValues={true}
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
                          isButtonDisabled ||
                          errors?.accTitle ||
                          formValue?.accTitle?.length < 1 ||
                          errors?.currTime ||
                          formValue?.currTime?.length < 1 ||
                          errors?.accBal ||
                          formValue?.accBal?.length < 1 ||
                          errors?.accNumber ||
                          formValue?.accNumber?.length < 1 ||
                          errors?.aiRate ||
                          formValue?.aiRate?.length < 1 ||
                          errors?.accOpen ||formValue?.accOpen?.length < 1 
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

export default AddBankAccountP2;
