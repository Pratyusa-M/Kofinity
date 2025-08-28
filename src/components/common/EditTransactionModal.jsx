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
import { useSelector, useDispatch } from "react-redux";
import { currencyOptions, fetchCurrencyOptionsApi, apiSuccess } from "../../redux/store/slice/currencyOptionsApi";
import { selectedMainCurrency, selectedMainCurrencyId } from "../../redux/store/slice/currencySlice";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { format } from "date-fns";
Modal.setAppElement("#root");

import { FiChevronDown } from "react-icons/fi"; // You can replace this with inline SVG if avoiding all libraries


export default function EditTransactionModal({
  isOpen,
  onRequestClose,
  transaction,
  tickerName,
  onSave,
  onRefresh,
  assetType = "crypto",
}) {
  console.log("transaction", transaction);
  console.log("tickerName", tickerName);
    const currApiSuccCond = useSelector(apiSuccess);
    const currencyOptionsData = useSelector(currencyOptions);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const dropdownRef = useRef();
const selectedCurrency = useSelector(selectedMainCurrency);
const selectedCurrencyId = useSelector(selectedMainCurrencyId);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


     useEffect(() => {
        const token = localStorage.getItem("token");
        if (!currApiSuccCond) {
          dispatch(fetchCurrencyOptionsApi(token));
        }
      }, []);

      const pad = (n) => String(n).padStart(2, '0');
const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1); 
  const dd = pad(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
};

  console.log(currencyOptionsData, "currency options data");
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
          value={transaction.transactionType === "sell" ? "Sell" : "Buy"}
          disabled
          className="w-full text-center bg-slate-800 text-white rounded-lg px-4 py-2"
        />
      </div>
      </div>
      <div className="overflow-y-auto flex-1 pr-2">
      <Formik
        enableReinitialize
        initialValues={{
          cryptoName: tickerName,
          brokerageAccount: transaction.brokerageAccount,
          currency: selectedCurrencyId ,
          quantity: transaction.quantity,
          price: transaction.price,
          transaction_date: transaction?.date ? new Date(transaction.date) : null,
          commission: Number(parseFloat(transaction.commission || 0).toFixed(2)), 
        }}
        validationSchema={Yup.object({
          currency: Yup.number()
            .typeError("Currency must be a number")
            .required("Currency is required"),
        
          quantity: Yup.number()
            .transform((value, originalValue) => {
              return typeof originalValue === "string" && originalValue.trim() === ""
                ? NaN
                : Number(originalValue);
            })
            .typeError("Quantity must be a valid number")
            .required("Quantity is required"),
        
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
          commission: Yup.number()
            .transform((value, originalValue) => {
              return typeof originalValue === "string" && originalValue.trim() === ""
                ? NaN
                : Number(originalValue);
            })
            .typeError("Commission must be a valid number")
        })}
        
        
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setIsLoading(true);
            const payload = {
              currency: parseFloat(values.currency),
              quantity: parseFloat(values.quantity),
              price: parseFloat(values.price),
              transaction_date: formatDate(values.transaction_date),
              commission: Number(parseFloat(values.commission).toFixed(2)) || 0,
            }
            const response = await axios.put(
              `${baseUrl}${assetType}/transaction/${transaction.id}`,
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
            toast.error(e.response.data?.message || "Failed to update transaction");
            if (e.response?.data?.message === "Validation failed") {
              e.response?.data?.data?.forEach((error) => {
                toast.error(error.message);
              });
            }
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
              <label className="block text-sm mb-1">Crypto Name / Ticker</label>
              <Field
                name="cryptoName"
                disabled
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Brokerage Account</label>
              <Field
                name="brokerageAccount"
                disabled
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm mb-1">Currency</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 flex justify-between items-center"
              >
                <span>
                  {
                    currencyOptionsData.find((opt) => opt.id === values.currency)
                      ?.option || "Select currency"
                  }
                </span>
                <FiChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-600 rounded-lg max-h-60 overflow-auto">
                  {currencyOptionsData.slice(0, 3).map((option) => (
                    <li
                      key={option.id}
                      onClick={() => {
                        setFieldValue("currency", option.id);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
                    >
                      {option.option}
                    </li>
                  ))}
                </ul>
              )}
              <div className="min-h-[20px]">
                <ErrorMessage
                  name="currency"
                  component="div"
                  className="text-red-400 text-sm"
                />
              </div>
            </div>

              <div>
                <label className="block text-sm mb-1">Quantity</label>
                <Field
                  name="quantity"
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-2"
                />
                  <div className="min-h-[20px]">
                <ErrorMessage name="quantity" component="div" className="text-red-400 text-sm" />
                </div>
              </div>

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
                <label className="block text-sm mb-1">Commission</label>
                <Field
                  name="commission"
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-2"
                />
                  <div className="min-h-[20px]">
                <ErrorMessage name="commission" component="div" className="text-red-400 text-sm" />
                </div>
              </div>

              <div className="">
                <label className="block text-sm mb-1">Date</label>
                <div className="datepicker-modal-override">
                  <DatePicker
                    selected={values.transaction_date}
                    onChange={(d) => setFieldValue("transaction_date", d)}
                    className="w-full bg-slate-800 text-white rounded-lg px-4 py-2"
                    popperPlacement="top-end"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                  />
                </div>
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
  tickerName: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};
