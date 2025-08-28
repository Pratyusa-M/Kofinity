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
import DummySelect from "../../components/common/dummyInput";
import { useDispatch, useSelector } from "react-redux";
import {
  setBuyCryptoCurrency,
  selectedBuyCryptoCurrency,
  selectedBuyCryptoCurrencyId,
  setBuyCryptoCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import moment from "moment/moment";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import { currencyOptions, fetchCurrencyOptionsApi, apiSuccess } from "../../redux/store/slice/currencyOptionsApi";
import { setBuyId,selectedBuyId } from "../../redux/store/slice/portfolioSlice";
const getFormValuesData = () => {
  const formData = localStorage.getItem("buyStocksFormData");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const getTickerName = () =>{
  const tName = localStorage.getItem("buyCryptoTickerName");

  if (tName !== null && tName !== undefined) {
    const data = tName
    return data;
  } else {
    return "";
  }
}


const BuyCrypto = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [accType, setAccType] = useState("savings");
  const [currencyData, setCurrencyData] = useState([]);
  const [brokerageId, setBrokeragId] = useState(1);
  const [brokerageData, setBrokerageData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [formData, setFormValues] = useState(getFormValuesData());
  const [cryptoData, setCryptoData] = useState([]);
  const buyingId = useSelector(selectedBuyId);
  const [buyCryptoTickerName, setBuyCryptoTickerName] = useState(getTickerName())

  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedBuyCryptoCurrency);
  const selecteddCurrencyId = useSelector(selectedBuyCryptoCurrencyId);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);
console.log(selecteddCurrencyId, "selected currency ")
  console.log(selectedCurrencyId, "selected currency aawdaw")
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location, "location data");

  const buyId = location?.state?.buyId;
  const assetName = location?.state?.buyName;

  useEffect(() => {
    // getCurrencyData();
  }, []);

  useEffect(() => {
    if (buyingId) {
      getCryptoData();
    }
  }, [buyingId, buyId]);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/buycrypto" } });
    }
  }, [brokerageId]);


console.log("formData", formData);
  useEffect(() => {
    const data = { ...formData, cryptoName:cryptoData?.ticker?.name };
    localStorage.setItem("buyCryptoFormData", JSON.stringify(data));
  }, [formData]);

  useEffect(() => {
    getBrokerageAccountDetails();
  }, [selecteddCurrencyId]);

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!currApiSuccCond) {
        dispatch(fetchCurrencyOptionsApi(token));
      }
    }, []);
  
    const getCryptoData = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${baseUrl}crypto/${buyId}?desiredCurrency=${selecteddCurrencyId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCryptoData(response?.data?.data);
          localStorage.setItem("buyCryptoTickerName", response?.data?.data?.ticker?.name)
          setBuyCryptoTickerName(response?.data?.data?.ticker?.name)
          setBrokeragId(response?.data?.data?.id);
        } catch (error) {
          console.log(error.message);
        }
      };

  const loadingDummyInput = (label) => {
      return (
        <div className="">
          <DummySelect placeholder={label} />
        </div>
      );
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

  const getBrokerageAccountDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selecteddCurrencyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )      
      const data = response?.data?.data;
      console.log(data, "brokerage account data");
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
      console.log(banksData, "bank data");
      setBrokerageData(banksData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const Accoptions = [
    { id: 1, name: "savings" },
    { id: 2, name: "current" },
  ];

  const options = [
    { id: 1, opt: "Account 1" },
    { id: 2, opt: "Account 2" },
    { id: 3, opt: "Account 3" },
  ];

  const initialValues = {
    buyQuantity: null,
    buyDate: "",
    buyPrice: null,
    buyFee: null,
  };

  const assetValidationSchema = Yup.object({
    buyQuantity: Yup.string().required("Buying quantity is required"),
    buyDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    buyPrice: Yup.string().required("Buying price is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}crypto/`,
        {
          crypto_currency_name: location?.state?.buyId,
          quantity: values?.buyQuantity,
          price: values?.buyPrice,
          currency: selecteddCurrencyId,
          commission: values?.buyFee,
          transaction_date: moment(values?.buyDate).format("YYYY-MM-DD"),
          bank_account: brokerageId,
          type: "buy",
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
          : "Crypto bought successfully";
      toast.success(successMessage);
      setTimeout(() => {
        navigate("/crypto");
      }, 2000);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (e) {
      setLoading(false);
       toast.error("Failed to buy crypto");
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
    console.log(currency, "currency data");
    dispatch(setBuyCryptoCurrency(currency.option));
    dispatch(setBuyCryptoCurrencyId(currency.id));
  };

  return (
    <AssetLayout
      heading={assetName}
      isSellAssets={true}
      closeRoute={"/crypto"}
      jsxProp={
        <>
          <ToastContainer />

          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Buy Crypto
            </h1>
            <Formik
  initialValues={initialValues}
  validationSchema={assetValidationSchema}
  onSubmit={handleSubmit}
>
  {({ errors, touched }) => (
    <Form className="flex flex-col">
      <div className="flex flex-wrap gap-x-10 gap-y-6">
        <div className="w-full sm:w-[calc(50%-2.5rem)]">
          <AssetInput
            labelText="Buying quantity"
            idText="buyQuantity"
            name="buyQuantity"
            htmlForText="buyQuantity"
            typeText="number"
            placeHolderText=""
            errText={errors.buyQuantity}
            validation={errors?.buyQuantity && touched?.buyQuantity}
            password={false}
            shouldPreventKeys={true}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-2.5rem)]">
          {brokerageData?.length > 0 ? (
            <BrokerageSelect
              data={brokerageData}
              placeholder="Brokerage account"
              setId={setBrokeragId}
              dataLength={brokerageData?.length}
            />
          ) : (
            loadingDummyInput("Brokerage account")
          )}
        </div>

        <div className="w-full sm:w-[calc(50%-2.5rem)]">
          <AssetPriceInput
            labelText="Buying price"
            idText="buyPrice"
            name="buyPrice"
            htmlForText="buyPrice"
            typeText="number"
            placeHolderText=""
            errText={errors.buyPrice}
            validation={errors?.buyPrice && touched?.buyPrice}
            curData={currencyOptionsData?.slice(0, 3)}
            settingCurrency={setAddStcksCurr}
            selectedCurrency={selecteddCurrency}
            shouldPreventKeys={true}
            setFormValues={setFormValues}
            isSetFormValues={true}
            passValue={formData?.buyPrice}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-2.5rem)]">
          <AssetPriceInput
            labelText="Buying fee (Optional)"
            idText="buyFee"
            name="buyFee"
            htmlForText="buyFee"
            typeText="number"
            placeHolderText=""
            errText={errors.buyFee}
            curData={currencyOptionsData?.slice(0, 3)}
            settingCurrency={setAddStcksCurr}
            selectedCurrency={selecteddCurrency}
            shouldPreventKeys={true}
            setFormValues={setFormValues}
            isSetFormValues={true}
            passValue={formData?.buyFee}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-2.5rem)]">
          <AssetDatePickerInput
            name="buyDate"
            label="Buying date (mm/dd/yyyy)"
            errText={errors.buyDate}
            validation={errors?.buyDate && touched?.buyDate}
            isShowFutureDates={true}
          />
        </div>

        <AutoSubmitToken setFormValue={setFormValue} />
      </div>

      {console.log("errors", errors)}

      <div className="mt-10 flex justify-end w-full">
        {loading ? (
          <LoadingButton />
        ) : (
          <AssetButton
            typeText="submit"
            disabled={
              errors?.buyQuantity ||
              formValue?.buyQuantity?.length < 1 ||
              errors?.buyPrice ||
              errors?.buyDate ||
              formValue?.buyPrice?.length < 1 ||
              formValue?.buyDate?.length < 1
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

export default BuyCrypto;
