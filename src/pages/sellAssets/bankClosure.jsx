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
import BrokerageSelect from "../../components/addAssets/brokerageSelect";
import DummySelect from "../../components/common/dummyInput";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setBankClosureCurrency,
  selectedBankClosureCurrency,
  selectedBankClosureCurrencyId,
  setBankClosureCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import moment from "moment/moment";

const BankClosure = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [banksData, setBanksData] = useState([]);
  const [bankId, setBankId] = useState();
  const [currencyData, setCurrencyData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedBankClosureCurrency);
  const selecteddCurrencyId = useSelector(selectedBankClosureCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const closeId = location?.state?.sellId;
  const assetName = location?.state?.sellName;

  const options = [
    { id: 1, opt: "Account 1" },
    { id: 2, opt: "Account 2" },
    { id: 3, opt: "Account 3" },
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
      const banksResponse = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selecteddCurrencyId}&bankAccountId=${closeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBanksData(banksResponse?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const initialValues = {
    totalCash: "",
    closureDate: "",
  };

  const assetValidationSchema = Yup.object({
    totalCash: Yup.string().required("Total cash is required"),
    closureDate: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.post(
        `${baseUrl}bank-account/close-account/${closeId}`,
        {
          destination_accountId: bankId,
          transfer_amount: values?.totalCash,
          closure_date: moment(values?.closureDate).format("YYYY-MM-DD"),
          currency: selecteddCurrencyId,
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
          : "Bank account updated successfully";
      toast.success(successMessage);
      setLoading(false);
      setTimeout(() => {
        navigate("/bankaccount");
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

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  const setAddStcksCurr = (currency) => {
    dispatch(setBankClosureCurrency(currency.option));
    dispatch(setBankClosureCurrencyId(currency.id));
  };

  return (
    <AssetLayout
      heading={assetName}
      isSellAssets={true}
      closeRoute={"/bankaccount"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Bank Closure
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
                        labelText="Total cash"
                        idText="totalCash"
                        name="totalCash"
                        htmlForText="totalCash"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.totalCash}
                        validation={errors?.totalCash && touched?.totalCash}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[24px] sm:mt-[0px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="closureDate"
                        label="Closure date(mm/dd/yyyy)"
                        errText={errors.closureDate}
                        validation={errors?.closureDate && touched?.closureDate}
                        isShowFutureDates={true}
                      />
                    </div>

                    <div className="-mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                      {banksData?.length > 0 ? (
                        <BrokerageSelect
                          data={banksData}
                          placeholder={"Transfer to"}
                          setId={setBankId}
                          dataLength={banksData?.length}
                        />
                      ) : (
                        loadingDummyInput("Transfer to")
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
                          errors?.totalCash ||
                          formValue?.totalCash?.length < 1 ||
                          errors?.closureDate ||
                          formValue?.closureDate?.length < 1
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

export default BankClosure;
