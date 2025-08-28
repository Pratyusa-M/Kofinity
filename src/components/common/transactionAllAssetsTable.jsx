/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Arrow1 from "../../assets/arrow1.svg";
import arrow2 from "../../assets/arrow2.svg";
import tableplus from "../../assets/tableplus.png";
import tableminus from "../../assets/tableminus.svg";
import tabledit from "../../assets/tabledit.svg";
import { Trash , Trash2, Pencil } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

import { useNavigate, useLocation } from "react-router-dom";
import { FormatNumberWithCommas } from "./commaSeparatedNumbers";
import { useDispatch, useSelector } from "react-redux";
import { SelectedCurrencySymbol } from "../../redux/store/slice/currencySlice";
import ConfirmDialog from "./ConfirmDeleteDialog";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

const TransactionsAllAssetsTable = ({
  tableHeadings,
  tableData,
  tableProps,
  loanAmount,
  financialType = "",
  onRefresh = () => {}, 
}) => {
  console.log("tableData", tableData);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // State for accordion
  const [expandedIndex, setExpandedIndex] = useState(null);

  const onNavigateToEditPages = (row) => {
    console.log("row", row);
    if (location.pathname === "/realestate") {
      navigate("/editrealestate3");
    } else if (location.pathname === "/bankaccount") {
      navigate("/editbankaccount");
    } else if (location.pathname === "/otherassets") {
      navigate("/editotherassets");
    }
    else if (location.pathname === "/debt") {
      navigate("/editdebt",
      { state: { data: row } });
    }
  };

  const checkPercentValue = (percentageString) => {
    const intValue = parseInt(percentageString.replace("%", ""), 10);
    return intValue < 0;
  };

  const onDeleteDebtAction = async (id) => {
    console.log("id", id);
    try {
      setIsDeleting(true);
     const res =  await axios.delete(`${baseUrl}loan/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("res", res);
      toast.success("Transaction deleted");
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
        setSelectedRowId(null); 
      setTimeout(() => {
        onRefresh?.();
      }, 1000);
    } catch {
      toast.error("Failed to delete transaction");
      setIsDeleteDialogOpen(false);
      setIsDeleting(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to get the primary identifier from row data
  const getPrimaryIdentifier = (row, finalrow) => {
    // Try to get a meaningful identifier (usually the first text column)
    if (finalrow.length > 1) {
      return finalrow[1]; // Usually the name/description
    }
    return finalrow[0] || "Item";
  };

  // Helper function to get secondary info for collapsed view
  const getSecondaryInfo = (row, finalrow) => {
    // Try to show amount or other relevant info
    if (finalrow.length > 2) {
      return finalrow[2];
    }
    return null;
  };

  return (
    <div>
      <ToastContainer/>
      <div className="relative text-roboto bg-[#191919] rounded-lg shadow-md">
        {/* Title & KPI */}
        <div className="p-6">
          <h2 className="text-white text-lg font-semibold">{tableProps?.title}</h2>
          <div className="text-[#A8A8A8] text-sm font-medium mt-4 mb-2">
            Total Amount
          </div>
          <div className="text-white text-2xl md:text-3xl font-normal">
            {selectedCurencySymbol}
            {FormatNumberWithCommas(loanAmount || 0) || 0}
          </div>
        </div>

        {tableData.length >= 1 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-y-auto max-h-[465px]">
              <table className="w-full text-roboto border-separate border-spacing-y-[10px] mb-2 table-auto">
                <thead>
                  <tr>
                    {tableHeadings?.map((heading, idx) => (
                      <th
                        key={idx}
                        scope="col"
                        className="px-[24px] py-[16px] text-start text-base font-[500] text-[#FFFFFF] leading-[20px]"
                      >
                        <p>{heading}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((row, idx) => {
                    // Slice the last 4 elements from the row for financial type "debt"
                    let finalrow = [];
                    if (financialType === "debt") {
                      finalrow = row.slice(0, row.length - 5);
                    } else {
                      finalrow = row;
                    }

                    return (
                      <tr className="bg-[#1D1D1F]" key={idx}>
                        {finalrow?.map((data, index) => (
                          <td
                            key={index}
                            className="px-[24px] py-[16px] text-[#F6F8FB] font-[400] text-base leading-[24px] tracking-[0.15px]"
                          >
                            {data}
                          </td>
                        ))}
                        
                        {/* Gain & Loss */}
                        {tableHeadings.map((rows, indexx) => {
                          return rows === "Gain & Loss" ? (
                            <td key={indexx} className="px-[24px] py-[16px]">
                              <div
                                className={`flex gap-2 justify-center items-center ${
                                  tableHeadings.length === 8
                                    ? "absolute right-50 -mt-[9px] "
                                    : "absolute right-60" ||
                                      tableHeadings.length === 5
                                    ? "absolute right-92 -mt-[9px]"
                                    : "absolute right-60"
                                }`}
                              >
                                <div
                                  className={`w-[37px] h-[24px] flex justify-center items-center text-[16px] text-roboto ${
                                    checkPercentValue(row[row.length - 1])
                                      ? "text-[#B91F1F]"
                                      : "text-[#1FB98B]"
                                  } font-[400]`}
                                >
                                  {row[row.length - 2]}
                                </div>

                                <div
                                  className={`w-[37px] h-[24px] flex justify-center items-center text-[10px] text-lato ml-5 ${
                                    checkPercentValue(row[row.length - 1])
                                      ? "text-[#B91F1F]"
                                      : "text-[#1FB98B]"
                                  } font-[400]`}
                                >
                                  {row[row.length - 1]}
                                </div>
                                <div className="w-[9.04px] flex justify-center relative right-2 self-center items-center h-[9.04px]">
                                  {checkPercentValue(row[row.length - 1]) ? (
                                    <img src={arrow2} alt="arrow" />
                                  ) : (
                                    <img src={Arrow1} alt="arrow" />
                                  )}
                                </div>
                              </div>
                            </td>
                          ) : null;
                        })}
                        
                        {/* Actions for different table types */}
                        {tableHeadings.map((item, indexes) => {
                          return item === "Actions" &&
                            tableHeadings.length === 8 ? (
                            <td
                              key={indexes}
                              className={`px-[24px] py-[16px] absolute right-8`}
                            >
                              <div className="flex gap-1 justify-center items-center ">
                                <div className="w-[17px] h-[16px] bg-[#2E2E2E] flex justify-center items-center rounded-full cursor-pointer">
                                  <img
                                    className="w-[8.79px] h-[8.7px]"
                                    src={tableplus}
                                    alt="+"
                                  />
                                </div>
                                <div className="w-[17px] h-[17px] flex justify-center items-center bg-[#2E2E2E] rounded-full cursor-pointer">
                                  <img
                                    className="w-[8.79px] h-[2px]"
                                    src={tableminus}
                                    alt="-"
                                  />
                                </div>
                                <div className="w-[18px] h-[17px] flex justify-center items-center bg-[#2E2E2E] rounded-full cursor-pointer">
                                  <img
                                    className="w-[6.59px] h-[7px]"
                                    src={tabledit}
                                    alt="edit"
                                  />
                                </div>
                              </div>
                            </td>
                          ) : null;
                        })}
                        
                        {/* Debt Actions */}
                        {tableHeadings.map((item, indexes) => {
                          return item === "Actions" &&
                            financialType === "debt" ? (
                            <td
                              key={indexes}
                              className={`px-[24px] py-[16px] absolute `}
                            >
                              <div className="flex gap-1 justify-center items-center ">
                                <div
                                  onClick={() => onNavigateToEditPages(row)}
                                  className="w-[30px]  flex justify-center items-center bg-[#2E2E2E] hover:bg-slate-500 rounded-full cursor-pointer"
                                >
                                  <img
                                    className="w-full p-2"
                                    src={tabledit}
                                    alt="edit"
                                  />
                                </div>
                                <div
                                  onClick={() => { setIsDeleteDialogOpen(true); setSelectedRowId(row[10]); }}
                                  className="w-[30px] flex justify-center items-center bg-[#2E2E2E] hover:bg-slate-500 rounded-full cursor-pointer"
                                >
                                  <Trash className="w-full p-1" />
                                </div>
                              </div>
                            </td>
                          ) : null
                        })}
                        
                        {/* Other Actions */}
                        {tableHeadings.map((item, indexes) => {
                          return item === "Actions" &&
                            tableHeadings.length === 5 ? (
                            <td
                              key={indexes}
                              className={`px-[24px] py-[16px] absolute ${
                                tableHeadings[1] === "Cash"
                                  ? "right-[10rem]"
                                  : "right-[117px]"
                              }`}
                            >
                              <div className="flex gap-1 justify-center items-center  ">
                                <div className="w-[17px] h-[17px] flex justify-center items-center bg-[#2E2E2E] rounded-full cursor-pointer">
                                  <img
                                    className="w-[8.79px] h-[2px]"
                                    src={tableminus}
                                    alt="-"
                                  />
                                </div>
                                <div
                                  onClick={onNavigateToEditPages}
                                  className="w-[18px] h-[17px] flex justify-center items-center bg-[#2E2E2E] rounded-full cursor-pointer"
                                >
                                  <img
                                    className="w-[6.59px] h-[7px]"
                                    src={tabledit}
                                    alt="edit"
                                  />
                                </div>
                              </div>
                            </td>
                          ) : null;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Accordion Cards */}
            <div className="block md:hidden p-4 space-y-3">
              {tableData.map((row, ridx) => {
                const isExpanded = expandedIndex === ridx;
                
                // Process row data based on financial type
                let finalrow = [];
                if (financialType === "debt") {
                  finalrow = row.slice(0, row.length - 5);
                } else {
                  finalrow = row;
                }
                
                const primaryInfo = getPrimaryIdentifier(row, finalrow);
                const secondaryInfo = getSecondaryInfo(row, finalrow);
                
                return (
                  <div key={ridx} className="bg-[#1D1D1F] rounded-lg overflow-hidden transition-all duration-200">
                    {/* Collapsed Header - Always Visible */}
                    <div className="px-3 py-3">
                      {/* Key Information */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-base truncate">
                            {primaryInfo}
                          </div>
                          
                          {/* Secondary info */}
                          {secondaryInfo && (
                            <div className="text-[#A8A8A8] text-sm mt-1">
                              {secondaryInfo}
                            </div>
                          )}
                          
                          {/* Show Gain/Loss if present and not expanded */}
                          {!isExpanded && tableHeadings.includes("Gain & Loss") && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-sm font-medium ${
                                checkPercentValue(row[row.length - 1]) ? "text-[#B91F1F]" : "text-[#1FB98B]"
                              }`}>
                                {selectedCurencySymbol}{row[row.length - 2]}
                              </span>
                              <span className={`text-xs ${
                                checkPercentValue(row[row.length - 1]) ? "text-[#B91F1F]" : "text-[#1FB98B]"
                              }`}>
                                {row[row.length - 1]}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => setExpandedIndex(isExpanded ? null : ridx)}
                          className="ml-3 p-2 hover:bg-[#2A2A2C] rounded-full transition-colors"
                        >
                          {isExpanded ? (
                            <FaChevronUp className="text-[#A8A8A8] w-4 h-4" />
                          ) : (
                            <FaChevronDown className="text-[#A8A8A8] w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Quick Action Buttons - Always Visible */}
                      <div className="flex flex-wrap gap-2">
                        {/* Conditional action buttons based on table type and financial type */}
                        {financialType === "debt" ? (
                          <>
                            <button
                              onClick={() => onNavigateToEditPages(row)}
                              className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                            >
                              <Pencil className="w-4" />
                            </button>
                            <button
                              onClick={() => setIsDeleteDialogOpen(true)}
                              className="px-3 py-1 bg-[#B91F1F] hover:bg-[#A01B1B] rounded text-white text-xs transition-colors"
                            >
                              <Trash2 className="w-4"/>
                            </button>
                          </>
                        ) : tableHeadings.length === 8 ? (
                          <>
                            <button className="px-3 py-1 bg-[#1FB98B] hover:bg-[#1AA076] rounded text-white text-xs transition-colors">
                              Add
                            </button>
                            <button className="px-3 py-1 bg-[#B91F1F] hover:bg-[#A01B1B] rounded text-white text-xs transition-colors">
                              Remove
                            </button>
                            <button className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors">
                              Edit
                            </button>
                          </>
                        ) : tableHeadings.length === 5 ? (
                          <>
                            <button className="px-3 py-1 bg-[#B91F1F] hover:bg-[#A01B1B] rounded text-white text-xs transition-colors">
                              Remove
                            </button>
                            <button
                              onClick={onNavigateToEditPages}
                              className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                            >
                              Edit
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-[#2A2A2C] px-3 py-3 bg-[#1A1A1C]">
                        <div className="space-y-2">
                          {tableHeadings.map((heading, hidx) => {
                            // Skip Actions column
                            if (heading === "Actions") return null;
                            
                            // Skip Gain & Loss - handle separately below
                            if (heading === "Gain & Loss") return null;
                            
                            // Get the corresponding data from finalrow
                            const dataColumns = tableHeadings.filter(h => h !== "Actions" && h !== "Gain & Loss");
                            const dataIndex = dataColumns.indexOf(heading);
                            
                            let cellValue;
                            if (dataIndex !== -1 && dataIndex < finalrow.length) {
                              cellValue = finalrow[dataIndex];
                            }
                            
                            if (cellValue === undefined) return null;
                            
                            // Skip if this heading was already shown in collapsed view (first two columns)
                            if (dataIndex === 0 || dataIndex === 1) return null;
                            
                            return (
                              <div key={hidx} className="flex justify-between items-center">
                                <span className="text-[#A8A8A8] font-medium text-sm">{heading}</span>
                                <span className="text-white text-sm">{cellValue}</span>
                              </div>
                            );
                          })}
                          
                          {/* Show Gain & Loss in expanded view */}
                          {tableHeadings.includes("Gain & Loss") && (
                            <div className="flex justify-between items-center">
                              <span className="text-[#A8A8A8] font-medium text-sm">Gain & Loss</span>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${
                                  checkPercentValue(row[row.length - 1]) ? "text-[#B91F1F]" : "text-[#1FB98B]"
                                }`}>
                                  {selectedCurencySymbol}{row[row.length - 2]}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className={`text-xs ${
                                    checkPercentValue(row[row.length - 1]) ? "text-[#B91F1F]" : "text-[#1FB98B]"
                                  }`}>
                                    {row[row.length - 1]}
                                  </span>
                                  <img
                                    src={checkPercentValue(row[row.length - 1]) ? arrow2 : Arrow1}
                                    alt="trend"
                                    className="w-3 h-3"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center text-[18px] mb-3 font-[400] text-white p-6">
            No Data Found
          </div>
        )}
        
        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          title="Confirm Delete"
          message="Are you sure you want to delete this item?"
          onConfirm={() => onDeleteDebtAction(selectedRowId)}
          onCancel={() => setIsDeleteDialogOpen(false)}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default TransactionsAllAssetsTable;