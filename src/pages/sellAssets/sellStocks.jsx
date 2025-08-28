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
import DummySelect from "../../components/common/dummyInput";
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setSellStocksCurrency,
  selectedSellStocksCurrency,
  selectedSellStocksCurrencyId,
  setSellStocksCurrencyId,
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
  const formData = localStorage.getItem("sellStocksFormData");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const SellStock = () => {
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

  const selecteddCurrency = useSelector(selectedSellStocksCurrency);
  const selecteddCurrencyId = useSelector(selectedSellStocksCurrencyId);
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
    localStorage.setItem("sellStocksFormData", JSON.stringify(data));
  }, [formData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!currApiSuccCond) {
      dispatch(fetchCurrencyOptionsApi(token));
    }
  }, []);

  useEffect(() => {
    if (brokerageId === bankDataLength) {
      navigate("/addbankaccount2", { state: { addBankRoute: "/sellstock" } });
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

  const Accoptions = [
    { id: 1, name: "savings" },
    { id: 2, name: "current" },
  ];

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

  const initialValues = {
    sellQuantity:formData.sellQuantity || "",
    sellDate:formData.sellDate || "",
    sellPrice:formData.sellPrice || "",
    sellFee:formData.sellFee || null,
  };

  const assetValidationSchema = Yup.object({
    sellQuantity: Yup.string().required("Selling quantity is required"),
    sellDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    sellPrice: Yup.string().required("Selling price is required"),
    // sellFee: Yup.string().required("selling fee is required"),
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
        `${baseUrl}stocks`,
        {
          quantity: values?.sellQuantity,
          stock_name: sellId,
          price: values?.sellPrice,
          commission: getSellingFee(values?.sellFee),
          transaction_date: moment(values?.sellDate).format("YYYY-MM-DD"),
          // account_type: accType,
          currency: selecteddCurrencyId,
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
          : "Stock sold successfully";
      toast.success(successMessage);
      setLoading(false);
      setTimeout(() => {
        navigate("/stocks");
        setIsButtonDisabled(false);
      }, 3000);
    } catch (error) {
      console.log(error?.response?.data?.message);
      setLoading(false);
      setIsButtonDisabled(false);
       toast.error(error?.response?.data?.message || "Something went wrong");
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
    dispatch(setSellStocksCurrency(currency.option));
    dispatch(setSellStocksCurrencyId(currency.id));
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const { sellDate } = formData;
  const sellingDate = sellDate ? moment(sellDate).format("L") : "";

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
              Sell Stock
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
                      <AssetInput
                        labelText="Selling quantity"
                        idText="sellQuantity"
                        name="sellQuantity"
                        htmlForText="sellQuantity"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.sellQuantity}
                        validation={
                          errors?.sellQuantity && touched?.sellQuantity
                        }
                        password={false}
                        shouldPreventKeys={true}
                        // profileSettings={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.sellQuantity}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[0px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Selling price"
                        idText="sellPrice"
                        name="sellPrice"
                        htmlForText="sellPrice"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.sellPrice}
                        validation={errors?.sellPrice && touched?.sellPrice}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.sellPrice}
                      />
                    </div>
                    <div className="mt-[24px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="sellDate"
                        label="Selling date(mm/dd/yyyy)"
                        errText={errors.sellDate}
                        validation={errors?.sellDate && touched?.sellDate}
                        isShowFutureDates={true}
                        setFormValues={setFormValues}
                        passValue={sellingDate}
                        isSetFormValues={true}
                      />
                    </div>

                    <div className="-mt-[24px] sm:mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetPriceInput
                        labelText="Selling fee(Optional)"
                        idText="sellFee"
                        name="sellFee"
                        htmlForText="sellFee"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.sellFee}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                        setFormValues={setFormValues}
                        isSetFormValues={true}
                        passValue={formData?.sellFee}
                        //   validation={errors?.sellFee && touched?.sellFee}
                      />
                    </div>
                    <div className="mt-[30px] sm:-mt-[24px] mb-0 w-[100%] sm:w-[47%]">
                      <AssetSelect
                        data={Accoptions}
                        placeholder={"Add Scenario"}
                        setId={setAccType}
                      />
                    </div>
                    <div className="mt-[32px] sm:-mt-[24px] w-[100%] sm:w-[47%]">
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
                  <div className="mb-3 mt-[40px] W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton
                        typeText={"submit"}
                        disabled={
                          isButtonDisabled ||
                          errors?.sellQuantity ||
                          formValue?.sellQuantity?.length < 1 ||
                          errors?.sellPrice ||
                          errors?.sellDate ||
                          formValue?.sellPrice?.length < 1 ||
                          formValue?.sellDate?.length < 1 || 
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

export default SellStock;
