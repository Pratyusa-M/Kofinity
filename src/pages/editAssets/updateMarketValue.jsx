/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";

import { Formik, Form } from "formik";
import * as Yup from "yup";
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
import {
  setMarketValueCurrency,
  selectedMarketValueCurrency,
  selectedMarketValueCurrencyId,
  setMarketValueCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import {
  currencyOptions,
  fetchCurrencyOptionsApi,
  apiSuccess,
} from "../../redux/store/slice/currencyOptionsApi";

import moment from "moment/moment";

const UpdateMarketValueOtherAsset = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();
  const selecteddCurrency = useSelector(selectedMarketValueCurrency);
  const selecteddCurrencyId = useSelector(selectedMarketValueCurrencyId);
  const currencyOptionsData = useSelector(currencyOptions);
  const currApiSuccCond = useSelector(apiSuccess);

  const selectedCurrency = useSelector(selectedMainCurrency);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  const navigate = useNavigate();
  const location = useLocation();

  const editId = location?.state?.marketId;
  const assetName = location?.state?.marketName;

  useEffect(() => {
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

  const Accoptions = [
    { id: 1, name: "savings" },
    { id: 2, name: "current" },
  ];

  const initialValues = {
    marketPrice: "",
    marketDate: "",
  };

  const assetValidationSchema = Yup.object({
    marketPrice: Yup.number().required("Market price is required"),
    marketDate: Yup.date().required("Date is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.put(
        `${baseUrl}other-asset/${editId}`,
        {
          market_price: values?.marketPrice,
          market_price_date: moment(values?.marketDate).format("YYYY-MM-DD"),
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
          : "Successfully updated other assets";
      toast.success(successMessage);
      setLoading(false);
      setTimeout(() => {
        navigate("/otherassets");
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

  const setAddStcksCurr = (currency) => {
    dispatch(setMarketValueCurrency(currency.option));
    dispatch(setMarketValueCurrencyId(currency.id));
  };

  return (
    <AssetLayout
      heading={assetName}
      isSellAssets={true}
      closeRoute={"/otherassets"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Update Market Value
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
                        labelText="Market Price"
                        idText="marketPrice"
                        name="marketPrice"
                        htmlForText="marketPrice"
                        typeText="number"
                        placeHolderText=""
                        errText={errors.marketPrice}
                        validation={errors?.marketPrice && touched?.marketPrice}
                        curData={currencyOptionsData}
                        settingCurrency={setAddStcksCurr}
                        selectedCurrency={selecteddCurrency}
                        shouldPreventKeys={true}
                      />
                    </div>
                    <div className="mt-[30px] sm:mt-[0px] mb-[4rem] w-[100%] sm:w-[47%]">
                      <AssetDatePickerInput
                        name="marketDate"
                        label="Market Value’s date(mm/dd/yyyy)"
                        errText={errors.marketDate}
                        validation={errors?.marketDate && touched?.marketDate}
                        isShowFutureDates={true}
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
                          errors?.marketPrice ||
                          formValue?.marketPrice?.length < 1 ||
                          errors?.marketDate ||
                          formValue?.marketDate?.length < 1
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

export default UpdateMarketValueOtherAsset;
