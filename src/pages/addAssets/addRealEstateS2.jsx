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
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import CategorykSelect from "../../components/addAssets/categorySelect";
import KindSelect from "../../components/addAssets/kindSelect";
import DummySelect from "../../components/common/dummyInput";

import axios from "axios";

const getFormValuesData = () => {
  const formData = localStorage.getItem("formData2");

  if (formData !== null && formData !== undefined) {
    const data = JSON.parse(formData);
    return data;
  } else {
    return {};
  }
};

const getKindCatgryData = (num) => {
  const data = localStorage.getItem("realDropDownData2");
  if (data !== null && data !== undefined) {
    const dataa = JSON.parse(data);
    if (num === 1) {
      return dataa.kindId;
    } else if (num === 2) {
      return dataa.kindText;
    } else if (num === 3) {
      return dataa.categoryId;
    } else if (num === 4) {
      return dataa.categoryText;
    }
  } else {
    if (num === 1) {
      return null;
    } else if (num === 2) {
      return "";
    } else if (num === 3) {
      return null;
    } else if (num === 4) {
      return "";
    }
  }
};

const AddRealEstateS2 = () => {
  const [formValue, setFormValue] = useState();
  const [formData, setFormValues] = useState(getFormValuesData());

  const [loading, setLoading] = useState(false);
  const [kindOptions, setKindOptions] = useState([]);
  const [categoryOptions, setcategoryOptions] = useState([]);
  const [kindId, setKindId] = useState(getKindCatgryData(1));
  const [kindText, setKindText] = useState(getKindCatgryData(2));
  const [categoryId, setCategoryId] = useState(getKindCatgryData(3));
  const [categoryText, setCategoryText] = useState(getKindCatgryData(4));
  const navigate = useNavigate();
  const location = useLocation();

  // console.log(kindOptions, categoryOptions, 'kind options')
  useEffect(() => {
    const data = { ...formData, kind: kindId, category: categoryId };
    localStorage.setItem("formData2", JSON.stringify(data));
  }, [formData, kindId, categoryId]);

  useEffect(() => {
    const data = {
      kindId: kindId,
      kindText: kindText,
      categoryId: categoryId,
      categoryText: categoryText,
    };
    localStorage.setItem("realDropDownData2", JSON.stringify(data));
  }, [kindId, categoryId]);

  const options = [
    { id: 1, option: "India" },
    { id: 2, option: "USA" },
    { id: 3, option: "London" },
  ];

  useEffect(() => {
    getKindOption();
    getCategorOptions();
  }, []);

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

  const initialValues = {
    description: formData.description || "",
  };

  const assetValidationSchema = Yup.object({
    description: Yup.string().required("address1 is required"),
  });

  const handleSubmit = async (values) => {
    OnNavigateRealEstatePage3(values);
  };

  const OnNavigateRealEstatePage3 = (values) => {
    // navigate("/addAssets", { state: { openModal: true } });
    const newState = {
      ...location.state,
      ...values,
      kind: kindId,
      category: categoryId,
    };
    navigate("/addrealestate3", { state: newState });
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
      heading={"Real Estate"}
      backRoute={"/addrealestate1"}
      closeRoute={"/addAssets"}
      isRealEstate={true}
      barWidth={"2/3"}
      jsxProp={
        <>
          <ToastContainer />
          <div className="">
            <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-[50px]">
              Add Real Estate
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={assetValidationSchema}
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
                        errText="description is required"
                        validation={errors?.description && touched?.description}
                        password={false}
                        setFormValues={setFormValues}
                        passValue={formData?.description}
                        isSetFormValues={true}
                        // profileSettings={true}
                      />
                    </div>
                    <div className="mt-[30px] sm:mt-[30px] mb-0 w-[100%] sm:w-[47%]">
                      {kindOptions?.length > 0 ? (
                        <KindSelect
                          data={kindOptions}
                          placeholder={"Kind"}
                          setId={setKindId}
                          setText={setKindText}
                          passText={kindText}
                        />
                      ) : (
                        loadingDummyInput("Kind")
                      )}
                    </div>
                    <div className="mt-[24px] sm:mt-[30px] mb-0 w-[100%] sm:w-[47%]">
                      {categoryOptions?.length > 0 ? (
                        <CategorykSelect
                          data={categoryOptions}
                          placeholder={"Category"}
                          setId={setCategoryId}
                          setText={setCategoryText}
                          passText={categoryText}
                        />
                      ) : (
                        loadingDummyInput("Category")
                      )}
                    </div>

                    <AutoSubmitToken setFormValue={setFormValue} />
                  </div>
                  <div className="mb-3 mt-10 W-[150px] self-end">
                    {loading ? (
                      <LoadingButton />
                    ) : (
                      <AssetButton
                        typeText={"submit"}
                        disabled={
                          errors?.description ||
                          formValue?.description?.length < 1 ||
                          kindId === null ||
                          categoryId === null
                        }
                        // onClick={OnNavigateAssetspage}
                      >
                        CONTINUE
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

export default AddRealEstateS2;
