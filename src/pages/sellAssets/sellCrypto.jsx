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
import { useDispatch, useSelector } from "react-redux";
import {
  setSellCryptoCurrency,
  selectedSellCryptoCurrency,
  selectedSellCryptoCurrencyId,
  setSellCryptoCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import moment from "moment/moment";
import DummySelect from "../../components/common/dummyInput";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import { currencyOptions } from "../../redux/store/slice/currencyOptionsApi";
const SellCrypto = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [accType, setAccType] = useState("savings");
  const [currencyData, setCurrencyData] = useState([]);
  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedSellCryptoCurrency);
  const selecteddCurrencyId = useSelector(selectedSellCryptoCurrencyId);
  const [brokerageId, setBrokeragId] = useState(null);
  const [brokerageData, setBrokerageData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);

  const navigate = useNavigate();
  const location = useLocation();

  const sellId = location?.state?.sellId;
  const assetName = location?.state?.sellName;

  useEffect(() => {
    // getCurrencyData();
  }, []);

  useEffect(() => {
    getBrokerageAccountDetails();
  }, [selecteddCurrencyId]);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/sellcrypto" } });
    }
  }, [brokerageId]);

  

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

  const options = [
    { id: 1, opt: "Account 1" },
    { id: 2, opt: "Account 2" },
    { id: 3, opt: "Account 3" },
  ];

  const Accoptions = [
    { id: 1, name: "savings" },
    { id: 2, name: "current" },
  ];

  const initialValues = {
    sellQuantity: null,
    sellDate: "",
    sellPrice: null,
    sellFee: null,
  };

  const assetValidationSchema = Yup.object({
    sellQuantity: Yup.string().required("Selling quantity is required"),
    sellDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    sellPrice: Yup.string().required("Selling price is required"),
    // sellFee: Yup.string().required("selling fee is required"),
  });

  const handleSubmit = async (values) => {
    console.log(values, "values");
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}crypto/`,
        {
          crypto_currency_name: location?.state?.sellId,
          quantity: values?.sellQuantity,
          price: values?.sellPrice,
          currency: selecteddCurrencyId,
          commission: values?.sellFee,
          transaction_date: moment(values?.sellDate).format("YYYY-MM-DD"),
          bank_account: brokerageId,
          type: "sell",
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
          : "Crypto sold successfully";
      toast.success(successMessage);
      setTimeout(() => {
        navigate("/crypto");
      }, 2000);
      setTimeout(() => {setLoading(false)},2000);
  
    } catch (e) {
      setLoading(false);
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
    dispatch(setSellCryptoCurrency(currency.option));
    dispatch(setSellCryptoCurrencyId(currency.id));
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
              Sell Crypto
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
            labelText="Selling quantity"
            idText="sellQuantity"
            name="sellQuantity"
            htmlForText="sellQuantity"
            typeText="number"
            placeHolderText=""
            errText={errors.sellQuantity}
            validation={errors?.sellQuantity && touched?.sellQuantity}
            password={false}
            shouldPreventKeys={true}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-2.5rem)]">
          <AssetPriceInput
            labelText="Selling price"
            idText="sellPrice"
            name="sellPrice"
            htmlForText="sellPrice"
            typeText="number"
            placeHolderText=""
            errText={errors.sellPrice}
            validation={errors?.sellPrice && touched?.sellPrice}
            curData={currencyOptionsData?.slice(0, 3)}
            settingCurrency={setAddStcksCurr}
            selectedCurrency={selecteddCurrency}
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
            labelText="Selling fee (Optional)"
            idText="sellFee"
            name="sellFee"
            htmlForText="sellFee"
            typeText="number"
            placeHolderText=""
            errText={errors.sellFee}
            curData={currencyOptionsData?.slice(0, 3)}
            settingCurrency={setAddStcksCurr}
            selectedCurrency={selecteddCurrency}
            shouldPreventKeys={true}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-2.5rem)]">
          <AssetDatePickerInput
            name="sellDate"
            label="Selling date (mm/dd/yyyy)"
            errText={errors.sellDate}
            validation={errors?.sellDate && touched?.sellDate}
            isShowFutureDates={true}
          />
        </div>

        <AutoSubmitToken setFormValue={setFormValue} />
      </div>

      <div className="mt-10 flex justify-end w-full">
        {loading ? (
          <LoadingButton />
        ) : (
          <AssetButton
            disabled={
              errors?.sellQuantity ||
              formValue?.sellQuantity?.length < 1 ||
              errors?.sellPrice ||
              errors?.sellDate ||
              formValue?.sellPrice?.length < 1 ||
              formValue?.sellDate?.length < 1
            }
            onClick={OnNavigateAssetspage}
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

export default SellCrypto;
