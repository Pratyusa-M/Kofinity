/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import AssetInput from "../../components/addAssets/assetInput";
import AssetSelect from "../../components/addAssets/assestSelect";
import EditBrokerageSelect from "../../components/editAssets/editBrokerageSelect";
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
import SearchInput from "../../components/addAssets/searchInput";
import moment from "moment/moment";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  setEditStocksCurrency,
  selectedEditStocksCurrency,
  selectedEditStocksCurrencyId,
  setEditStocksCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import {
  setEditId,
  selectedEditId,
} from "../../redux/store/slice/portfolioSlice";

const EditStocks = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [stocksData, setStocksData] = useState([]);
  const [brokerageData, setBrokerageData] = useState([]);
  const [brokerageId, setBrokeragId] = useState(null);
  const [bankDataLength, setbankDataLength] = useState();

  const [StockNameData, setStockNameData] = useState([]);
  const [stockId, setStockId] = useState();
  const [stockName, setStockName] = useState();
  const [dataUpdated, setDataUpdated] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [formattedDate, setFormattedDate] = useState("");
  const [currencyData, setCurrencyData] = useState([]);
  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedEditStocksCurrency);
  const selecteddCurrencyId = useSelector(selectedEditStocksCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

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
      getStocksData();
    }
  }, [editingId, editId]);

  useEffect(() => {
    // getStocksData();
    getBrokerageAccountDetails();
    getStockNameData();
    // getCurrencyData();
  }, [dataUpdated, setDataUpdated]);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/editStocks" } });
    }
  }, [brokerageId]);

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

  const getStocksData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}stocks/${editId}?desiredCurrency=${selecteddCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStocksData(response?.data?.data);
      setBrokeragId(response?.data?.data?.id);
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
      data.forEach((item) => {
        const accountNumber = item.account_number.toString(); // Convert account number to string
        const lastFourDigits = accountNumber.slice(-4); // Get last four digits
        const hiddenDigits = "*".repeat(accountNumber.length - 4); // Create string of asterisks for hidden digits
        const modifiedName = `${item.bank_name.name}( ${hiddenDigits}${lastFourDigits} )`; // Concatenate modified name
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

  const getStockNameData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}ticker?tickerType=stocks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStockNameData(response?.data?.data);
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
    stockName: "",
    purQuantity: null,
    PurDate: "",
    Commission: null,
    purPrice: "",
  };

  const assetValidationSchema = Yup.object({
    stockName: Yup.string().required("stock name is required"),
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

  const getCommission = (com) => {
    if (com !== "") {
      return com;
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
        `${baseUrl}stocks/${editId}`,
        {
          stock_name: stockId,
          purchase_quantity: values?.purQuantity,
          purchase_price: values?.purPrice,
          // purchase_date: values?.PurDate,
          purchase_date: getDateString(values?.PurDate),
          commission: getCommission(values?.Commission),
          bank_account: brokerageId,
          currency: selecteddCurrencyId,
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
        navigate("/stocks");
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

  useEffect(() => {
    const date = new Date(stocksData?.purchase_date);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    setFormattedDate(formattedDate);
  }, [stocksData?.purchase_date]);

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setEditStocksCurrency(currency.option));
    dispatch(setEditStocksCurrencyId(currency.id));
  };

  const getPassedBankAccount = () => {
    const bankName = stocksData?.bank_account?.bank_name?.name;
    const accNo = stocksData?.bank_account?.account_number;

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
      backRoute={"/stocks"}
      closeRoute={"/stocks"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[40px]">
              Edit Stocks
            </h1>
            <Formik
              initialValues={initialValues}
              // validationSchema={assetValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col">
                  <div className="flex flex-row justify-between flex-wrap">
                    <div className="mt-[0px] mb-0 w-[100%] sm:w-[47%]">
                      <SearchInput
                        labelText="Stock name/Ticker"
                        data={StockNameData}
                        setStockName={setStockName}
                        setStockId={setStockId}
                        stockName={stockName}
                        idText="stockName"
                        name="stockName"
                        htmlForText="stockName"
                        typeText="text"
                        placeHolderText=""
                        errText={errors.stockName}
                        validation={errors?.stockName && touched?.stockName}
                        searchText={formValue?.stockName}
                        password={false}
                        passValue={stocksData?.ticker?.name}
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
                        passValue={stocksData?.purchase_quantity}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[32px] sm:mt-[32px] mb-0 w-[100%] sm:w-[47%]">
                      {brokerageData?.length > 0 ? (
                        <BrokerageSelect
                          data={brokerageData}
                          placeholder={"Brokerage account"}
                          setId={setBrokeragId}
                          passId={stocksData?.bank_account?.id}
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
                        passValue={stocksData?.commission}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
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
                        passValue={stocksData?.purchase_price}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[18px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="PurDate"
                        label="Purchase date(mm/dd/yyyy)"
                        errText={errors.PurDate}
                        validation={errors?.PurDate && touched?.PurDate}
                        isShowFutureDates={true}
                        passValue={moment(stocksData?.purchase_date).format(
                          "L"
                        )}
                      />
                    </div>
                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-3 -mt-3 W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton disabled={isButtonDisabled} typeText={"submit"}>UPDATE</AssetButton>
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

export default EditStocks;
