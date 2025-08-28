// src/components/common/EditTransactionModal.jsx
import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { selectedMainCurrencyId } from "../../redux/store/slice/currencySlice";
Modal.setAppElement("#root");



export default function EditTransactionModal({
  isOpen,
  onRequestClose,
  transaction,
  onSave,
  onRefresh,
  plType,
  id,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const selectedCurrencyId = useSelector(selectedMainCurrencyId);






    
  return (
    <>
    <ToastContainer />
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="w-full lg:max-w-[60vw] max-w-[90vw] mx-auto mt-8 bg-[#1F1F22] p-4 sm:p-6 rounded-lg border border-slate-700 text-white
      max-h-[90vh] flex flex-col"
overlayClassName="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <div className="flex justify-between items-center mb-4">

      <h2 className="text-xl font-bold mb-4">Edit Transaction</h2>
      <div className="mb-2 flex justify-center items-center w-24 text-center">
  <input
    type="text"
    value={transaction.remarks}
    disabled
    className="w-full text-center bg-slate-800 text-white rounded-lg px-4 py-2"
  />
</div>
</div>
      <div className="overflow-y-auto flex-1 pr-2">
      <Formik
        enableReinitialize
        initialValues={{
          brokerageAccount: transaction.brokerageAccount,
          price: transaction.price,
          transaction_date: (() => {
            const [dd, mm, yyyy] = transaction.date.split("/");
            return new Date(`${yyyy}-${mm}-${dd}`);
          })(),
        }}
        validationSchema={Yup.object({
        
          price: Yup.number()
            .transform((value, originalValue) => {
              return typeof originalValue === "string" && originalValue.trim() === ""
                ? NaN
                : Number(originalValue);
            })
            .typeError("Price must be a valid number")
            .required("Price is required"),
        
          transaction_date: Yup.date()
            .typeError("Please enter a valid date")
            .required("Transaction date is required"),
        })}
        
        
        onSubmit={async (values, { setSubmitting }) => {
  try {
  setIsLoading(true);
    const payload = {
      type: plType,
      id: id,
       transactionId: parseInt(transaction.id),
      desiredCurrency: selectedCurrencyId,
      
      price: parseInt(values.price),
      transaction_date: values.transaction_date.toISOString().slice(0,10),
    };
    const response = await axios.put(
      `${baseUrl}profit-loss/edit/transactions-list`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    // onSave({ ...transaction, ...payload, date: values.transaction_date });
    toast.success(response.data.message || "Transaction updated successfully");

    setTimeout(() => {
      onRefresh?.();
      onRequestClose();
      setIsLoading(false);
    }, 1500);
    

  } catch (e) {
    console.error(e);
    toast.error("Failed to update transaction");
    setIsLoading(false);
  } finally {
    setSubmitting(false);
    
  }
}}

      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-4">
            {/* Full width */}
            
            <div>
              <label className="block text-sm mb-1">Brokerage Account</label>
              <Field
                name="brokerageAccount"
                disabled
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
              <div>
                <label className="block text-sm mb-1">Price</label>
                <Field
                  name="price"
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-2"
                />
                  <div className="min-h-[20px]">
                <ErrorMessage name="price" component="div" className="text-red-400 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Date</label>
                <DatePicker
                  selected={values.transaction_date}
                  onChange={(d) => setFieldValue("transaction_date", d)}
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-2"
                />
                <div className="min-h-[20px]">
                <ErrorMessage
                  name="transaction_date"
                  component="div"
                  className="text-red-400 text-sm"
                />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onRequestClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                {isSubmitting ? ( <TailSpin
              height="20"
              width="20"
              color="#fff"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />) : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      </div>
    </Modal>
    </>
  );
}

EditTransactionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  transaction: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};
