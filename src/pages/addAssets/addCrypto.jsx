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
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import DummySelect from "../../components/common/dummyInput";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddCryptoCurrency,
  selectedAddCryptoCurrency,
  selectedAddCryptoCurrencyId,
  setAddCryptoCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import SearchInput from "../../components/addAssets/searchInput";
import moment from "moment/moment";
import { currencyOptions } from "../../redux/store/slice/currencyOptionsApi";
import { selectedBuyCryptoCurrency, selectedBuyCryptoCurrencyId } from "../../redux/store/slice/currencySlice";
const getFormValuesData = () => {
  const formData = localStorage.getItem("CryptoFormData");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const getCryptoId = () => {
  const data = localStorage.getItem("cryptoTickerId");
  if (data !== null && data !== undefined) {
    const dataa = JSON.parse(data);
    return dataa.cryptoId;
  } else {
    return null;
  }
};

const AddCrypto = () => {
  const [formValue, setFormValue] = useState();
  const [formData, setFormValues] = useState(getFormValuesData());
  const [loading, setLoading] = useState(false);
  const [brokerageData, setBrokerageData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [brokerageId, setBrokeragId] = useState(null);
  const [currencyData, setCurrencyData] = useState([]);
  const [CryptoNameData, setCryptoNameData] = useState([]);
  const [cryptoName, setCryptoName] = useState();
  const [cryptoId, setCryptoId] = useState(getCryptoId());
  const currencyOptionsData = useSelector(currencyOptions);
 
  const dispatch = useDispatch();
  const selectedAddCryptCurrency = useSelector(selectedAddCryptoCurrency);
  const selectedAddCryptCurrencyId = useSelector(selectedAddCryptoCurrencyId);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const navigate = useNavigate();

  useEffect(() => {
    const data = { ...formData, cryptoId: cryptoId };
    localStorage.setItem("CryptoFormData", JSON.stringify(data));
  }, [formData, cryptoId]);

  useEffect(() => {
    const data = {
      cryptoId: cryptoId,
    };
    localStorage.setItem("cryptoTickerId", JSON.stringify(data));
  }, [cryptoId]);

  useEffect(() => {
    getBrokerageAccountDetails();
    // getCurrencyData();
    getCryptoNameData();
  }, []);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/addcrypto" } });
    }
  }, [brokerageId]);

  const getCryptoNameData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}ticker?tickerType=crypto`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCryptoNameData(response?.data?.data);
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

  const getBrokerageAccountDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}bank-account?desiredCurrency=${selectedAddCryptCurrencyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const options = [
    { id: 1, opt: "Account 1" },
    { id: 2, opt: "Account 2" },
    { id: 3, opt: "Account 3" },
  ];

  const initialValues = {
    ccName: formData?.ccName || "",
    purQuantity: formData?.purQuantity || null,
    PurDate: formData?.PurDate || "",
    Commission: formData?.Commission || null,
    purPrice: formData?.purPrice || null,
  };

  const assetValidationSchema = Yup.object({
    ccName: Yup.string().required("Crypto currency name is required"),
    purQuantity: Yup.string().required("Purchase quantity is required"),

    PurDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    purPrice: Yup.string().required("Purchase price is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}crypto`,
        {
          crypto_currency_name: cryptoId,
          quantity: values?.purQuantity,
          price: values?.purPrice,
          currency: selectedCurrencyId,
          transaction_date: moment(values?.PurDate).format("YYYY-MM-DD"),
          commission: values?.Commission,
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
          : "Successfully added Crypto details";
      toast.success(successMessage);
      setLoading(false);
      OnNavigateAssetspage();
      setTimeout(() => {
        // navigate('/addAssets')
      }, 2000);
    } catch (e) {
      console.log(e?.response?.data?.message);
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
    navigate("/addAssets", { state: { openModal: true } });
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setAddCryptoCurrency(currency.option));
    dispatch(setAddCryptoCurrencyId(currency.id));
  };

  const { PurDate } = formData;
  const purchaseDate = PurDate ? moment(PurDate).format("L") : "";

  return (
    <AssetLayout
      heading={"CRYPTO"}
      backRoute={"/addAssets"}
      closeRoute={"/addAssets"}
      jsxProp={
        <>
          <ToastContainer />

          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Add Crypto
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
                      {/* <AssetInput
                      labelText="Crypto currency name/Ticker"
                      idText="cName"
                      name="cName"
                      htmlForText="cName"
                      typeText="text"
                      placeHolderText=""
                      errText={errors.cName}
                      validation={errors?.cName && touched?.cName}
                      password={false}
                      // profileSettings={true}
                    /> */}
                      <SearchInput
                        labelText="Crypto currency name/Ticker"
                        data={CryptoNameData}
                        setStockName={setCryptoName}
                        setStockId={setCryptoId}
                        stockName={cryptoName}
                        idText="ccName"
                        name="ccName"
                        htmlForText="ccName"
                        typeText="text"
                        placeHolderText=""
                        errText={errors?.ccName}
                        validation={errors?.ccName && touched?.ccName}
                        searchText={formData?.ccName}
                        password={false}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.stockName}
                        // passValue={cryptoData?.ticker?.name}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[0px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Purchase quantity"
                        idText="purQuantity"
                        name="purQuantity"
                        htmlForText="purQuantity"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.purQuantity}
                        validation={errors?.purQuantity && touched?.purQuantity}
                        password={false}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.purQuantity}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[32px] mb-0 w-[100%] sm:w-[47%]">
                      {console.log(brokerageData, "brokerage data")}
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
                    <div className="mt-[18px] sm:mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Commission(Optional)"
                        idText="Commission"
                        name="Commission"
                        htmlForText="Commission"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.Commission}
                        curData={currencyOptionsData?.slice(0, 3)}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedAddCryptCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.Commission}
                        //   validation={errors?.Commission && touched?.Commission}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[18px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Purchase price"
                        idText="purPrice"
                        name="purPrice"
                        htmlForText="purPrice"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.purPrice}
                        validation={errors?.purPrice && touched?.purPrice}
                        curData={currencyOptionsData?.slice(0, 3)}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedAddCryptCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.purPrice}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[18px] mb-[4rem] w-[100%] sm:w-[47%] ">
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

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-3  W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton
                        type={"submit"}
                        disabled={
                          errors?.ccName ||
                          errors?.purQuantity ||
                          formValue?.ccName?.length < 1 ||
                          formValue?.purQuantity?.length < 1 ||
                          errors?.PurDate ||
                          formValue?.PurDate?.length < 1 ||
                          errors?.purPrice ||
                          formValue?.purPrice?.length < 1 ||
                          cryptoId === null ||
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

export default AddCrypto;
