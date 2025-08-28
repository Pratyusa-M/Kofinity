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
import KindSelect from "../../components/addAssets/kindSelect";
import CategorykSelect from "../../components/addAssets/categorySelect";
import DummySelect from "../../components/common/dummyInput";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setRealEstateName,
  selectedRealEstateName,
} from "../../redux/store/slice/portfolioSlice";

// import { selectedMainCurrencyId } from "../../redux/store/slice/currencySlice";
import {
  setEditRealEstateCurrency,
  selectedEditRealEstateCurrency,
  selecteEditRealEstateCurrencyId,
  setEditRealEstateCurrencyId,
  selectedMainCurrency,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";

const EditRealEstateS2 = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const [realEstateData, setRealEstateData] = useState([]);
  const [kindOptions, setKindOptions] = useState([]);
  const [categoryOptions, setcategoryOptions] = useState([]);
  const [kindId, setKindId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [dataUpdated, setDataUpdated] = useState(false);
  const [kindText, setKindText] = useState("");
  const [categoryText, setCategoryText] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedRealEstName = useSelector(selectedRealEstateName);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);
  const selecteddCurrencyId = useSelector(selecteEditRealEstateCurrencyId);

  //const editId =  location?.state?.editId;
  const editId = localStorage.getItem("editid");
  // const assetName = location?.state?.editName

  const options = [
    { id: 1, opt: "India" },
    { id: 2, opt: "USA" },
    { id: 3, opt: "London" },
  ];

  useEffect(() => {
    getRealEstateDataById();
    getKindOption();
    getCategorOptions();
  }, [dataUpdated]);

  const getKindOption = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}lists?type=realestate&subtype=kind`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setKindOptions(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCategorOptions = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}lists?type=realestate&subtype=category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setcategoryOptions(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getRealEstateDataById = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}real-estate/${editId}?desiredCurrency=${selecteddCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRealEstateData(response?.data?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const initialValues = {
    description: "",
  };

  const assetValidationSchema = Yup.object({
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    setIsButtonDisabled(true);
    try {
      const response = await axios.put(
        `${baseUrl}real-estate/${editId}`,
        {
          description: values?.description,
          kind: kindId,
          category: categoryId,
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
          : "Successfully updated real estate details";
      toast.success(successMessage);
      setLoading(false);
      setDataUpdated(true);

      setTimeout(() => {
        OnNavigateAssetspage(editId);
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

  const OnNavigateAssetspage = (id) => {
    // navigate("/addAssets", { state: { openModal: true } });
    navigate("/editrealestate3", { state: { editId: id } });
    setIsButtonDisabled(false);
  };

  const loadingDummyInput = (label) => {
    return (
      <div className="">
        <DummySelect placeholder={label} />
      </div>
    );
  };

  return (
    <AssetLayout
      heading={selectedRealEstName}
      backRoute={"/editrealestate1"}
      closeRoute={"/realestate"}
      isRealEstate={true}
      barWidth={"2/3"}
      jsxProp={
        <>
          <ToastContainer />

          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Edit Real Estate
            </h1>
            <Formik
              initialValues={initialValues}
              // validationSchema={assetValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="flex flex-col">
                  <div className="flex flex-row justify-between flex-wrap">
                    <div className=" mb-0 w-[100%]">
                      <AssetInput
                        labelText="Description"
                        idText="description"
                        name="description"
                        htmlForText="description"
                        typeText="text"
                        placeHolderText=""
                        errText={errors.description}
                        validation={errors?.description && touched?.description}
                        password={false}
                        passValue={realEstateData?.description}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[30px] sm:mt-[30px] mb-0 w-[100%] sm:w-[47%]">
                      {/* <AssetSelect data={options} placeholder={"Kind"} /> */}
                      {kindOptions?.length > 0 ? (
                        <KindSelect
                          data={kindOptions}
                          placeholder={"Kind"}
                          setId={setKindId}
                          passId={realEstateData?.kind?.id}
                          passOpt={realEstateData?.kind?.option}
                          setText={setKindText}
                        />
                      ) : (
                        loadingDummyInput("Kind")
                      )}
                    </div>
                    <div className="mt-[24px] sm:mt-[30px] mb-0 w-[100%] sm:w-[47%]">
                      {/* <AssetSelect data={options} placeholder={"Category"} /> */}
                      {categoryOptions?.length > 0 ? (
                        <CategorykSelect
                          data={categoryOptions}
                          placeholder={"Category"}
                          setId={setCategoryId}
                          passId={realEstateData?.category?.id}
                          passOpt={realEstateData?.category?.option}
                          setText={setCategoryText}
                        />
                      ) : (
                        loadingDummyInput("Category")
                      )}
                    </div>

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="flex items-center gap-3 self-end">
                    <div className="mb-3 mt-10 W-[150px] self-end">
                      <AssetButton onClick={() => OnNavigateAssetspage(editId)}>
                        CONTINUE
                      </AssetButton>
                    </div>
                    <div className="mb-3 mt-10 W-[150px] self-end">
                      {loading ? (
                        <LoadingButton />
                      ) : (
                        <AssetButton typeText={"submit"} disabled={ isButtonDisabled}>Update</AssetButton>
                      )}
                    </div>
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

export default EditRealEstateS2;
