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
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setBuyStocksCurrency,
  selectedBuyStocksCurrency,
  selectedBuyStocksCurrencyId,
  setBuyStocksCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import {
  setBuyId,
  selectedBuyId,
} from "../../redux/store/slice/portfolioSlice";

import DummySelect from "../../components/common/dummyInput";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import moment from "moment/moment";

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
  const tName = localStorage.getItem("buyStockTickerName");

  if (tName !== null && tName !== undefined) {
    const data = tName
    return data;
  } else {
    return "";
  }
}

const BuyStock = () => {
  const [formValue, setFormValue] = useState();
  const [formData, setFormValues] = useState(getFormValuesData());
  const [buyStockTickerName, setBuyStockTickerName] = useState(getTickerName())
  const [loading, setLoading] = useState(false);
  const [accType, setAccType] = useState("savings");
  const [currencyData, setCurrencyData] = useState([]);
  const [brokerageData, setBrokerageData] = useState([]);
  const [brokerageId, setBrokeragId] = useState(1);
  const [bankDataLength, setbankDataLength] = useState();
  const [stocksData, setStocksData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedBuyStocksCurrency);
  const selecteddCurrencyId = useSelector(selectedBuyStocksCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const buyingId = useSelector(selectedBuyId);
  const navigate = useNavigate();
  const location = useLocation();

  const buyId = location?.state?.buyId;
  const assetName = location?.state?.buyName;

  const Accoptions = [
    { id: 1, name: "savings" },
    { id: 2, name: "current" },
  ];

  useEffect(() => {
    const data = { ...formData, stockName:stocksData?.ticker?.name };
    localStorage.setItem("buyStocksFormData", JSON.stringify(data));
  }, [formData]);

  useEffect(() => {
    if (buyStockTickerName) {
      localStorage.setItem("buyStockTickerName", buyStockTickerName);
    }
  }, [buyStockTickerName]);

  useEffect(() => {
    if (buyId) {
      dispatch(setBuyId(buyId));
    }
  }, [buyId]);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/buystock" } });
    }
  }, [brokerageId]);

  useEffect(() => {
    // getCurrencyData();
    getBrokerageAccountDetails();
    // getStocksData()
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currApiSuccCond) {
      dispatch(fetchCurrencyOptionsApi(token));
    }
  }, []);

  // const getStocksData = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}stocks/${buyId}?desiredCurrency=${selecteddCurrencyId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setStocksData(response?.data?.data);
  //     localStorage.setItem("buyStockTickerName", response?.data?.data?.ticker?.name)
  //     setBuyStockTickerName(response?.data?.data?.ticker?.name)
  //     setBrokeragId(response?.data?.data?.id);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

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
    stockName: formData.stockName || stocksData?.ticker?.name,
    buyQuantity:formData.buyQuantity || "",
    buyDate:formData.buyDate || "",
    buyPrice:formData.buyPrice || "",
    buyFee:formData.buyFee || null,
  };

  const assetValidationSchema = Yup.object({
    buyQuantity: Yup.string().required("Buying quantity is required"),
    buyDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    buyPrice: Yup.string().required("Buying price is required"),
    // buyFee: Yup.string().required("selling fee is required"),
  });

  const getBuyingFee = (fee) => {
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
        `${baseUrl}stocks`,
        {
          stock_name: buyId,
          quantity: values?.buyQuantity,
          price: values?.buyPrice,
          commission: getBuyingFee(values?.buyFee),
          transaction_date: moment(values?.buyDate).format("YYYY-MM-DD"),
          // account_type: accType,
          currency: selecteddCurrencyId,
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
          : "Stock bought successfully";
      toast.success(successMessage);
      setLoading(false);
      setTimeout(() => {
        navigate("/stocks");
        setIsButtonDisabled(false);
      }, 3000);
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

  const OnNavigateAssetspage = () => {
    // navigate('/addAssets',{ state: { openModal: true } })
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setBuyStocksCurrency(currency.option));
    dispatch(setBuyStocksCurrencyId(currency.id));
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const getBankAccount = () => {
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

  const { buyDate } = formData;
  const buyingDate = buyDate ? moment(buyDate).format("L") : "";

  return (
    <AssetLayout
      heading={assetName}
      isSellAssets={true}
      closeRoute={"/stocks"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Buy Stock
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={assetValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col">
                  <div className="flex flex-row justify-between flex-wrap">
                    
                    <div className="mt-[32px] sm:mt-[6px] w-[100%] sm:w-[47%]">
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
                    {/* <div className="mt-[32px] sm:mt-[0px] w-[100%] sm:w-[47%]">
                      <AssetInput
                        labelText="Brokerage account"
                        idText="brAccount"
                        name="brAccount"
                        htmlForText="brAccount"
                        typeText="text"
                        placeHolderText=""
                        // errText={errors.buyQuantity}
                        // validation={errors?.buyQuantity && touched?.buyQuantity}
                        password={false}
                        passValue={getBankAccount()}
                        isDisabled={true}
                        // profileSettings={true}
                      />
                    </div> */}
                    <div className="mt-[15px] mb-0 w-[100%] sm:w-[47%]">
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
                        // profileSettings={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.buyQuantity}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[15px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Buying price"
                        idText="buyPrice"
                        name="buyPrice"
                        htmlForText="buyPrice"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.buyPrice}
                        validation={errors?.buyPrice && touched?.buyPrice}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.buyPrice}
                      />
                    </div>
                    <div className="mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Buying fee(Optional)"
                        idText="buyFee"
                        name="buyFee"
                        htmlForText="buyFee"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.buyFee}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                        //   validation={errors?.sellFee && touched?.sellFee}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.buyFee}
                      />
                    </div>
                    <div className="mt-[20px] sm:mt-[24px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="buyDate"
                        label="Buying date(mm/dd/yyyy)"
                        errText={errors.buyDate}
                        validation={errors?.buyDate && touched?.buyDate}
                        isShowFutureDates={true}
                        setFormValues={setFormValues}
                        passValue={buyingDate}
                        isSetFormValues={true}
                      />
                    </div>
                    <div className="mt-[35px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetSelect
                        data={Accoptions}
                        placeholder={"Add Scenario"}
                        setId={setAccType}
                      />
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
                          errors?.buyQuantity ||
                          formValue?.buyQuantity?.length < 1 ||
                          errors?.buyPrice ||
                          errors?.buyDate ||
                          formValue?.buyPrice?.length < 1 ||
                          formValue?.buyDate?.length < 1 || 
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

export default BuyStock;
