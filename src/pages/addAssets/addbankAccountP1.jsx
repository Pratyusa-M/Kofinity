/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import AssetInput from "../../components/addAssets/assetInput";
import AssetSelect from "../../components/addAssets/assestSelect";
import AssetPriceInput from "../../components/addAssets/priceInput";
import AssetDatePickerWithTime from "../../components/addAssets/assetDatePickerWithTime";
import LoadingButton from "../../components/auth/LoadingButton";
import AutoSubmitToken from "../../components/auth/AutoSubmitToken";
import AssetButton from "../../components/addAssets/assetButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddBankAccountP1 = () => {
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const options = [
    { id: 1, opt: "Saving Account" },
    { id: 2, opt: "Current Account" },
  ];

  const initialValues = {
    bankName: "",
    accTitle: "",
    curTime: "",
    accNumber: "",
    accBal: "",
  };

  const assetValidationSchema = Yup.object({
    bankName: Yup.string().required("bank name is required"),
    accTitle: Yup.string().required("Account Title is required"),

    curTime: Yup.date()
      // .max(new Date(), "Date cannot be earlier than today")
      .required("Date is required"),
    accNumber: Yup.string().required("Account number is required"),
    accBal: Yup.string().required("Account balance is required"),
  });

  const handleSubmit = () => {};

  const OnNavigateAddbankaccount2 = () => {
    // navigate('/addAssets',{ state: { openModal: true } })
    navigate("/addbankaccount2");
  };

  return (
    <AssetLayout
      heading={"BANK ACCOUNT"}
      backRoute={"/addAssets"}
      closeRoute={"/addAssets"}
      jsxProp={
        <div className="">
          <h1 className="text-[#ffffff] text-[24px] font-[500] text-roboto mb-5">
            Add Bank Account
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={assetValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col">
                <div className="flex flex-row justify-between flex-wrap">
                  <div className="mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                    <AssetInput
                      labelText="Bank name"
                      idText="bankName"
                      name="bankName"
                      htmlForText="bankName"
                      typeText="text"
                      placeHolderText=""
                      errText={errors.bankName}
                      validation={errors?.bankName && touched?.bankName}
                      password={false}
                      // profileSettings={true}
                    />
                  </div>
                  <div className="mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                    <AssetInput
                      labelText="Account title"
                      idText="accTitle"
                      name="accTitle"
                      htmlForText="accTitle"
                      typeText="text"
                      placeHolderText=""
                      errText={errors.accTitle}
                      validation={errors?.accTitle && touched?.accTitle}
                      password={false}
                      // profileSettings={true}
                    />
                  </div>
                  <div className="mt-[20px] mb-0 w-[100%] sm:w-[47%]">
                    <AssetSelect data={options} placeholder={"Account type"} />
                  </div>
                  <div className="mt-[60px] sm:mt-[10px] mb-0 w-[100%] sm:w-[47%]">
                    <AssetInput
                      labelText="Account number"
                      idText="accNumber"
                      name="accNumber"
                      htmlForText="accNumber"
                      typeText="number"
                      placeHolderText=""
                      errText={errors.accNumber}
                      validation={errors?.accNumber && touched?.accNumber}
                      password={false}
                      // profileSettings={true}
                    />
                  </div>
                  <div className="mt-[10px] mb-0 w-[100%] sm:w-[47%]">
                    <AssetPriceInput
                      labelText="Account balance"
                      idText="accBal"
                      name="accBal"
                      htmlForText="accBal"
                      typeText="number"
                      placeHolderText=""
                      errText={errors.accBal}
                      validation={errors?.accBal && touched?.accBal}
                    />
                  </div>
                  <div className="mt-[10px] mb-0 w-[100%] sm:w-[47%]">
                    <AssetDatePickerWithTime
                      name="curTime"
                      label="Current time(dd/mm/yyyy)"
                      errText={errors.curTime}
                      validation={errors?.curTime && touched?.curTime}
                    />
                  </div>

                  <AutoSubmitToken setFormValue={setFormValue} />
                </div>
                <div className="mb-3 -mt-3 W-[150px] self-end">
                  {loading ? (
                    <LoadingButton />
                  ) : (
                    <AssetButton
                      disabled={
                        errors?.bankName ||
                        errors?.accTitle ||
                        formValue?.bankName?.length < 1 ||
                        formValue?.accTitle?.length < 1 ||
                        errors?.curTime ||
                        formValue?.curTime?.length < 1 ||
                        errors?.accBal ||
                        formValue?.accBal?.length < 1 ||
                        errors?.accNumber ||
                        formValue?.accNumber?.length < 1
                      }
                      onClick={OnNavigateAddbankaccount2}
                    >
                      CONTINUE
                    </AssetButton>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      }
    />
  );
};

export default AddBankAccountP1;
