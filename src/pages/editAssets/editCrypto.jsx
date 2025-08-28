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
import DummySelect from "../../components/common/dummyInput";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import moment from "moment/moment";
import SearchInput from "../../components/addAssets/searchInput";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditCryptoCurrency,
  selectedEditCryptoCurrency,
  selectedEditCryptoCurrencyId,
  setEditCryptoCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";

import {
  setEditId,
  selectedEditId,
} from "../../redux/store/slice/portfolioSlice";

const EditCrypto = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [brokerageData, setBrokerageData] = useState([]);
  const [brokerageId, setBrokeragId] = useState(null);
  const [bankDataLength, setbankDataLength] = useState();

  const [cryptoData, setCryptoData] = useState([]);
  const [cryptoId, setCryptoId] = useState(null);
  const [CryptoNameData, setCryptoNameData] = useState([]);
  const [cryptoName, setCryptoName] = useState();
  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedEditCryptoCurrency);
  const selecteddCurrencyId = useSelector(selectedEditCryptoCurrencyId);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const editingId = useSelector(selectedEditId);

  const navigate = useNavigate();
  const location = useLocation();
  const editId = location?.state?.editId;
  const assetName = location?.state?.editName;

  useEffect(() => {
    if (editId) {
      dispatch(setEditId(editId));
    }
  }, [editId]);

  useEffect(() => {
    if (editingId) {
      getCryptoData();
    }
  }, [editingId, editId]);

  useEffect(() => {
    // getCryptoData();
    getBrokerageAccountDetails();
    getCryptoNameData();
    // getCurrencyData();
  }, [dataUpdated, setDataUpdated]);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/editcrypto" } });
    }
  }, [brokerageId]);

  const options = [
    { id: 1, opt: "Account 1" },
    { id: 2, opt: "Account 2" },
    { id: 3, opt: "Account 3" },
  ];

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

  const getCryptoData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}crypto/${editId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCryptoData(response?.data?.data);
      setBrokeragId(response?.data?.data?.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBrokerageAccountDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}bank-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response?.data?.data;
      data.forEach((item) => {
        const accountNumber = item.account_number.toString();
        const lastFourDigits = accountNumber.slice(-4);
        const hiddenDigits = "*".repeat(accountNumber.length - 4);
        const modifiedName = `${item.bank_name.name}( ${hiddenDigits}${lastFourDigits} )`;
        item.bank_name.name = modifiedName;
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

  const initialValues = {
    ccName: "",
    purQuantity: "",
    PurDate: "",
    Commission: "",
    purPrice: "",
  };

  const assetValidationSchema = Yup.object({
    ccName: Yup.string().required("Crypto currency name is required"),
    purQuantity: Yup.string().required("Purchase quantity is required"),

    PurDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    Commission: Yup.string().required("commision is required"),
    purPrice: Yup.string().required("Purchase price is required"),
  });

  const getDateString = (date) => {
    const d = new Date(date);
    const isoDate = moment(d.toISOString()).format("YYYY-MM-DD");
    return isoDate;
  };

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.put(
        `${baseUrl}crypto/${editId}`,
        {
          crypto_currency_name: cryptoId,
          purchase_quantity: values?.purQuantity,
          purchase_price: values?.purPrice,
          // purchase_date: values?.PurDate,
          purchase_date: getDateString(values?.PurDate),
          commission: values?.Commission,
          bank_account: brokerageId,
          currency: selectedCurrencyId,
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
          : "Successfully added Stocks details";
      toast.success(successMessage);
      setLoading(false);
      setDataUpdated(true);
      setTimeout(() => {
        // navigate('/addAssets')
      }, 2000);
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

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setEditCryptoCurrency(currency.option));
    dispatch(setEditCryptoCurrencyId(currency.id));
  };

  const getPassedBankAccount = () => {
    const bankName = cryptoData?.bank_account?.bank_name?.name;
    const accNo = cryptoData?.bank_account?.account_number;

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
      heading={assetName}
      backRoute={"/crypto"}
      closeRoute={"/crypto"}
      jsxProp={
        <>
          <ToastContainer />

          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Edit Crypto
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
                        searchText={formValue?.ccName}
                        password={false}
                        passValue={cryptoData?.ticker?.name}
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
                        passValue={cryptoData?.purchase_quantity}
                        shouldPreventKeys={true}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[32px] mb-0 w-[100%] sm:w-[47%]">
                      {brokerageData?.length > 0 ? (
                        <BrokerageSelect
                          data={brokerageData}
                          placeholder={"Brokerage account"}
                          setId={setBrokeragId}
                          passId={cryptoData?.bank_account?.id}
                          dataLength={brokerageData?.length}
                          passOpt={getPassedBankAccount()}
                          //passOpt={stocksData?.}
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
                        passValue={cryptoData?.commission}
                        curData={currencyData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedCurrency}
                        shouldPreventKeys={true}
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
                        passValue={cryptoData?.purchase_price}
                        curData={currencyData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedCurrency}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[18px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="PurDate"
                        label="Purchase date(mm/dd/yyyy)"
                        errText={errors.PurDate}
                        validation={errors?.PurDate && touched?.PurDate}
                        passValue={moment(cryptoData?.purchase_date).format(
                          "L"
                        )}
                        isShowFutureDates={true}
                      />
                    </div>

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-3 -mt-3 W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton
                        typeText={"submit"}
                        disabled={
                          errors?.ccName ||
                          errors?.purQuantity ||
                          formValue?.ccName?.length < 1 ||
                          formValue?.purQuantity?.length < 1 ||
                          errors?.PurDate ||
                          formValue?.PurDate?.length < 1 ||
                          errors?.purPrice ||
                          formValue?.purPrice?.length < 1
                        }
                      >
                        UPDATE
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

export default EditCrypto;
