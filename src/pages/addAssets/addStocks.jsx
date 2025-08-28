/* eslint-disable react-hooks/exhaustive-deps */
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
import StockNameSelect from "../../components/addAssets/stockNameSelect";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import DummySelect from "../../components/common/dummyInput";
import SearchInput from "../../components/addAssets/searchInput";
import { useDispatch, useSelector } from "react-redux";
import {
  setAddStocksCurrency,
  selectedAddStocksCurrency,
  selectedAddStocksCurrencyId,
  setAddStocksCurrencyId,
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
  const formData = localStorage.getItem("StocksFormData");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const getStockId = () => {
  const data = localStorage.getItem("StockTickerId");
  if (data !== null && data !== undefined) {
    const dataa = JSON.parse(data);
    return dataa.stockId;
  } else {
    return null;
  }
};

const AddStocks = () => {
  const [formValue, setFormValue] = useState();
  const [formData, setFormValues] = useState(getFormValuesData());
  const [loading, setLoading] = useState(false);
  const [stockId, setStockId] = useState(getStockId());
  const [stockName, setStockName] = useState();
  const [brokerageId, setBrokeragId] = useState(null);
  const [StockNameData, setStockNameData] = useState([]);
  // const [filteredData,setFilteredData] = useState([])
  const [brokerageData, setBrokerageData] = useState([]);
  const [bankDataLength, setbankDataLength] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const dispatch = useDispatch();
  const selectedAddStockCurrency = useSelector(selectedAddStocksCurrency);
  const selectedAddStockCurrencyId = useSelector(selectedAddStocksCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  console.log(currencyOptionsData, "currency options data");
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const navigate = useNavigate();

  const options = [
    { id: 1, name: "Account 1" },
    { id: 2, name: "Account 2" },
    { id: 3, name: "Account 3" },
  ];

  useEffect(() => {
    const data = { ...formData, stockId: stockId };
    localStorage.setItem("StocksFormData", JSON.stringify(data));
  }, [formData, stockId]);

  useEffect(() => {
    const data = {
      stockId: stockId,
    };
    localStorage.setItem("StockTickerId", JSON.stringify(data));
  }, [stockId]);

  useEffect(() => {
    getStockNameData();
    getBrokerageAccountDetails();
    // getCurrencyData();
  }, []);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/addstocks" } });
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

  const getStockNameData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}ticker?tickerType=stocks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStockNameData(response?.data?.data);
      // dispatch(setAddStocksCurrency(response?.data?.data[0]?.option))
      // dispatch(setAddStocksCurrencyId(response?.data?.data[0]?.id))
      console.log(response?.data?.data, "stocks data");
    } catch (error) {
      console.log(error.message);
    }
  };

  const getBrokerageAccountDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selectedAddStockCurrencyId}`,
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

  const initialValues = {
    stockName: formData.stockName || "",
    purQuantity: formData.purQuantity || "",
    PurDate: formData.PurDate || "",
    Commission: formData.Commission || "",
    purPrice: formData.purPrice || "",
  };

  const assetValidationSchema = Yup.object({
    purQuantity: Yup.number().required("Purchase quantity is required"),
    stockName: Yup.string().required("stock name quantity is required"),

    PurDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    Commission: Yup.string(),
    purPrice: Yup.string().required("Purchase price is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}stocks`,
        {
          stock_name: stockId,
          quantity: values?.purQuantity,
          price: values?.purPrice,
          transaction_date: moment(values?.PurDate).format("YYYY-MM-DD"),
          commission: values?.Commission || null,
          currency: selectedAddStockCurrencyId,
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
          : "Successfully added Stocks details";
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
    dispatch(setAddStocksCurrency(currency.option));
    dispatch(setAddStocksCurrencyId(currency.id));
  };

  const { PurDate } = formData;
  const purchaseDate = PurDate ? moment(PurDate).format("L") : "";

  return (
    <AssetLayout
      heading={"STOCKS"}
      backRoute={"/addAssets"}
      closeRoute={"/addAssets"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[40px]">
              Add Stocks
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
                        searchText={formData?.stockName}
                        password={false}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.stockName}
                        //  setFilteredData={setFilteredData}
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
                    <div className="mt-[32px] sm:mt-[32px] w-[100%] sm:w-[47%]">
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
                        labelText="Commission (optional)"
                        idText="Commission"
                        name="Commission"
                        htmlForText="Commission"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.Commission}
                        validation={errors?.Commission && touched?.Commission}
                        // curData={currencyData}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedAddStockCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.Commission}
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
                        // curData={currencyData}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selectedAddStockCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.purPrice}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[18px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="PurDate"
                        label="Purchase date(mm/dd/yyyy)"
                        errText={errors.PurDate}
                        validation={errors?.PurDate && touched?.PurDate}
                        isShowFutureDates={true}
                        shouldPreventKeys={true}
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
                        typeText={"submit"}
                        disabled={
                          errors?.stockName ||
                          formValue?.stockName?.length < 1 ||
                          errors?.purQuantity ||
                          formValue?.purQuantity?.length < 1 ||
                          errors?.Commission ||
                          errors?.PurDate ||
                          formValue?.PurDate?.length < 1 ||
                          errors?.purPrice ||
                          formValue?.purPrice?.length < 1 ||
                          stockId === null ||
                          brokerageId === null
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
        </>
      }
    />
  );
};

export default AddStocks;
