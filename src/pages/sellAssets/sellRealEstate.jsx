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
import { useDispatch, useSelector } from "react-redux";
import DummySelect from "../../components/common/dummyInput";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import {
  setSellRealEstateCurrency,
  selectedSellRealEstateCurrency,
  selecteSellRealEstateCurrencyId,
  setSellRealEstateCurrencyId,
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
  const formData = localStorage.getItem("sellRealEstateFormData");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const SellRealEstate = () => {
  const [formValue, setFormValue] = useState();
  const [formData, setFormValues] = useState(getFormValuesData());
  const [loading, setLoading] = useState(false);
  const [accType, setAccType] = useState("savings");
  const [currencyData, setCurrencyData] = useState([]);
  const [brokerageData, setBrokerageData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [brokerageId, setBrokeragId] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedSellRealEstateCurrency);
  const selecteddCurrencyId = useSelector(selecteSellRealEstateCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const navigate = useNavigate();
  const location = useLocation();

  const sellId = location?.state?.sellId;
  const assetName = location?.state?.sellName;

  useEffect(() => {
    // getCurrencyData();
    getBrokerageAccountDetails();
  }, []);
  useEffect(() => {
    const data = { ...formData };
    localStorage.setItem("sellRealEstateFormData", JSON.stringify(data));
  }, [formData]);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currApiSuccCond) {
      dispatch(fetchCurrencyOptionsApi(token));
    }
  }, []);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/sellrealestate" } });
    }
  }, [brokerageId]);

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

  const getBrokerageAccountDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selecteddCurrencyId}`,
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

  const Accoptions = [
    { id: 1, name: "savings" },
    { id: 2, name: "current" },
  ];

  const initialValues = {
    sellingPrice:formData.sellingPrice || "",
    sellingDate:formData.sellingDate ||  "",
    sellingFee:formData.sellingFee ||  null,
  };

  const assetValidationSchema = Yup.object({
    sellingPrice: Yup.string().required("Selling price is required"),
    sellingDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    // sellingFee: Yup.string().required("Selling price is required"),
  });

  const getSellingFee = (fee) => {
    if (fee !== "") {
      return fee;
    } else {
      return null;
    }
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.post(
        `${baseUrl}real-estate/sell/${sellId}`,
        {
          selling_price: values?.sellingPrice,
          selling_fee: getSellingFee(values?.sellingFee),
          selling_date: moment(values?.sellingDate).format("YYYY-MM-DD"),
          account_type: accType,
          currency: selecteddCurrencyId,
          bank_account: brokerageId,
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
          : "Real estate sold successfully";
      toast.success(successMessage);
      setLoading(false);
      setTimeout(() => {
        navigate("/realestate");
        setIsButtonDisabled(false);
      }, 3000);
    } catch (error) {
      console.log(error?.response?.data?.message);
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

  const OnNavigateAssetspage = () => {
    // navigate('/addAssets',{ state: { openModal: true } })
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setSellRealEstateCurrency(currency.option));
    dispatch(setSellRealEstateCurrencyId(currency.id));
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const { sellingDate } = formData;
  const sellDate = sellingDate ? moment(sellingDate).format("L") : "";

  return (
    <AssetLayout
      heading={assetName}
      isSellAssets={true}
      closeRoute={"/realestate"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Sell Real Estate
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
                      <AssetPriceInput
                        labelText="Selling price"
                        idText="sellingPrice"
                        name="sellingPrice"
                        htmlForText="sellingPrice"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.sellingPrice}
                        validation={
                          errors?.sellingPrice && touched?.sellingPrice
                        }
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.sellPrice}
                      />
                    </div>
                    <div className="mt-[30px] sm:mt-[0px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="sellingDate"
                        label="Selling date(mm/dd/yyyy)"
                        errText={errors.sellingDate}
                        validation={errors?.sellingDate && touched?.sellingDate}
                        isShowFutureDates={true}
                        setFormValues={setFormValues}
                        passValue={sellDate}
                        isSetFormValues={true}
                      />
                    </div>
                    <div className="-mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Selling fee(Optional)"
                        idText="sellingFee"
                        name="sellingFee"
                        htmlForText="sellingFee"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.sellingFee}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.sellPrice}
                        //   validation={errors?.sellingFee && touched?.sellingFee}
                      />
                    </div>
                    <div className="mt-[30px] sm:-mt-[14px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetSelect
                        data={Accoptions}
                        placeholder={"Add Scenario"}
                        setId={setAccType}
                      />
                    </div>
                    <div className="mt-[32px] sm:mt-[24px] w-[100%] sm:w-[47%]">
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
                  <div className="mb-3 mt-[50px] W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton
                        typeText={"submit"}
                        disabled={
                          isButtonDisabled ||
                          errors?.sellingPrice ||
                          formValue?.sellingPrice?.length < 1 ||
                          errors?.sellingDate ||
                          formValue?.sellingDate?.length < 1 || 
                          brokerageId === null
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

export default SellRealEstate;
