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
import { useNavigate, useLocation } from "react-router-dom";
import { FormatNumberWithCommas } from "./commaSeparatedNumbers";
import { useDispatch, useSelector } from "react-redux";
import { SelectedCurrencySymbol } from "../../redux/store/slice/currencySlice";
import { Ban, Pencil, History } from "lucide-react";

const BankAccountTable = ({
  tableHeadings,
  tableData,
  tableProps,
  profit,
  profitPercent,
  assetValue,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  
  // State for accordion
  const [expandedIndex, setExpandedIndex] = useState(null);

  const onNavigateToEditPages = () => {
    if (location.pathname === "/realestate") {
      navigate("/editrealestate3");
    } else if (location.pathname === "/bankaccount") {
      navigate("/editbankaccount");
    } else if (location.pathname === "/otherassets") {
      navigate("/editotherassets");
    }
  };

  const onEditAssets = (id, name) => {
    if (location.pathname === "/realestate") {
      navigate("/editrealestate1", { state: { editId: id } });
      localStorage.setItem("editid", id);
    } else if (location.pathname === "/bankaccount") {
      navigate("/editbankaccount", { state: { editId: id, editName: name } });
    } else if (location.pathname === "/otherassets") {
      navigate("/editotherassets", { state: { editId: id } });
    } else if (location.pathname === "/stocks") {
      navigate("/editStocks", { state: { editId: id } });
    }
  };

  const onNavigateToBuyAssets = (id) => {
    if (location.pathname === "/realestate") {
      navigate("/buyrealestate", { state: { buyId: id } });
    } else if (location.pathname === "/bankaccount") {
      navigate("/buybankaccount", { state: { buyId: id } });
    } else if (location.pathname === "/otherassets") {
      navigate("/buyotherassets", { state: { buyId: id } });
    } else if (location.pathname === "/stocks") {
      navigate("/buystock", { state: { buyId: id } });
    }
  };

  const onNavigateToSellAssets = (id, name) => {
    if (location.pathname === "/realestate") {
      navigate("/sellrealestate", { state: { sellId: id } });
    } else if (location.pathname === "/bankaccount") {
      navigate("/bankclosure", { state: { sellId: id, sellName: name } });
    } else if (location.pathname === "/otherassets") {
      navigate("/sellotherassets", { state: { sellId: id } });
    } else if (location.pathname === "/stocks") {
      navigate("/sellstock", { state: { sellId: id } });
    }
  };

  const getBankNameWithAccNo = (bankName, accNo) => {
    const accStr = accNo.toString();
    const maskedAccNo =
      accStr.length > 4
        ? "*".repeat(accStr.length - 4) + accStr.slice(-4)
        : accStr;
    return `${bankName}( ${maskedAccNo} )`;
  };

  const onNavigateToTransactionHistory = (id, bankName, accNo) => {
    if (location.pathname === "/bankaccount") {
      navigate("/banktransactionhistory", {
        state: {
          bankTransHistoryId: id,
          bankTransRoute: "/bankaccount",
          bankName: getBankNameWithAccNo(bankName, accNo),
        },
      });
    }
  };

  const checkPercentValue = (percentageString) => {
    const intValue = parseInt(percentageString?.replace("%", ""), 10);
    return intValue < 0;
  };

  // Helper function to determine which headings should be shown in collapsed view
  const getCollapsedHeadings = (headings) => {
    // Always show the bank name (usually first data column - index 1 since we skip row[0])
    const collapsedHeadings = new Set([1]); // First data column (bank name)
    
    // Add Gain & Loss to collapsed view if it exists
    const gainLossIndex = headings.findIndex(h => h === "Gain & Loss");
    if (gainLossIndex !== -1) {
      collapsedHeadings.add(gainLossIndex);
    }
    
    return collapsedHeadings;
  };

  return (
    <div>
      <div className="relative text-roboto bg-[#191919] rounded-lg shadow-md">
        {/* Title & KPI */}
        <div className="p-6">
          <h2 className="text-white text-lg font-semibold">{tableProps?.title}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="text-white text-2xl font-normal">
              {selectedCurencySymbol}
              {FormatNumberWithCommas(assetValue || 0)}
            </div>
            <div
              className={`text-base font-normal ${
                profitPercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
              }`}
            >
              {selectedCurencySymbol}
              {FormatNumberWithCommas(profit || 0)}
            </div>
            <div
              className={`flex items-center gap-2 text-sm font-normal px-2 py-1 rounded ${
                profitPercent >= 0
                  ? "text-[#1FB98B] bg-[#153f1e]"
                  : "text-[#B91F1F] bg-[#3f1515]"
              }`}
            >
              <span>{(profitPercent || 0).toFixed(2)}%</span>
              <img src={profitPercent >= 0 ? Arrow1 : arrow2} alt="trend" />
            </div>
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
                  {tableData?.map((row, idx) => (
                    <tr className="bg-[#1D1D1F]" key={idx}>
                      {/* Data columns (skip first column which is ID) */}
                      {row.slice(1, row.length - 2)?.map((data, index) => (
                        <td
                          onClick={() =>
                            onNavigateToTransactionHistory(
                              row[0],
                              row[1],
                              row[2]
                            )
                          }
                          key={index}
                          className="px-[24px] py-[16px] text-[#F6F8FB] cursor-pointer font-[400] text-base leading-[24px] tracking-[0.15px]"
                        >
                          {data}
                        </td>
                      ))}
                      
                      {/* Gain & Loss */}
                      {tableHeadings.includes("Gain & Loss") && (
                        <td className="px-[24px] py-[16px]">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex justify-center items-center text-[16px] text-roboto ${
                                checkPercentValue(row[row.length - 1])
                                  ? "text-[#B91F1F]"
                                  : "text-[#1FB98B]"
                              } font-[400]`}
                            >
                              {selectedCurencySymbol}
                              {row[row.length - 2]}
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex justify-center items-center text-[10px] text-lato ${
                                  checkPercentValue(row[row.length - 1])
                                    ? "text-[#B91F1F]"
                                    : "text-[#1FB98B]"
                                } font-[400]`}
                              >
                                {row[row.length - 1]}
                              </div>
                              <div className="flex justify-center relative right-2 self-center items-center h-[9.04px]">
                                {checkPercentValue(row[row.length - 1]) ? (
                                  <img src={arrow2} alt="arrow" />
                                ) : (
                                  <img src={Arrow1} alt="arrow" />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}
                      
                      {/* Actions */}
                      {tableHeadings.includes("Actions") && (
                        <td className="px-[24px] py-[16px] align-middle">
                          <div className="flex gap-2 items-center">
                            {tableHeadings.length === 8 && (
                              <div
                                onClick={() => onNavigateToBuyAssets(row[0])}
                                className="w-[17px] h-[16px] bg-[#2E2E2E] flex justify-center items-center rounded-full cursor-pointer"
                              >
                                <img
                                  className="w-[8.79px] h-[8.7px]"
                                  src={tableplus}
                                  alt="+"
                                />
                              </div>
                            )}
                            <div
                              onClick={() => onNavigateToSellAssets(row[0], row[1])}
                              className="w-[17px] h-[17px] flex justify-center items-center bg-[#2E2E2E] rounded-full cursor-pointer"
                            >
                              <img
                                className="w-[8.79px] h-[2px]"
                                src={tableminus}
                                alt="-"
                              />
                            </div>
                            <div
                              onClick={() => onEditAssets(row[0], row[1])}
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
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Accordion Cards */}
            <div className="block md:hidden p-4 space-y-3">
              {tableData.map((row, ridx) => {
                const isExpanded = expandedIndex === ridx;
                const collapsedHeadings = getCollapsedHeadings(tableHeadings);
                
                return (
                  <div key={ridx} className="bg-[#1D1D1F] rounded-lg overflow-hidden transition-all duration-200">
                    {/* Collapsed Header - Always Visible */}
                    <div className="px-3 py-3">
                      {/* Key Information */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium text-base truncate">
                            {row[1]} {/* Bank name */}
                          </div>
                          
                          {/* Account number (masked) */}
                          <div className="text-[#A8A8A8] text-sm mt-1">
                            {getBankNameWithAccNo("", row[2]).replace("( ", "").replace(" )", "")}
                          </div>
                          
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
                        <button
                          onClick={() => onNavigateToTransactionHistory(row[0], row[1], row[2])}
                          className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                        >
                          <History className="w-4"/>
                        </button>
                        
                        {/* Conditional action buttons based on table type */}
                        {tableHeadings.length === 8 && (
                          <button 
                            onClick={() => onNavigateToBuyAssets(row[0])}
                            className="px-3 py-1 bg-[#1FB98B] hover:bg-[#1AA076] rounded text-white text-xs transition-colors"
                          >
                            Add
                          </button>
                        )}
                        
                        <button 
                          onClick={() => onNavigateToSellAssets(row[0], row[1])}
                          className="px-3 py-1 bg-[#2E2e2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                        >
                         <Ban className="w-4" />
                        </button>
                        
                        <button
                          onClick={() => onEditAssets(row[0], row[1])}
                          className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                        >
                          <Pencil  className="w-4"/>
                        </button>
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
                            
                            // Get the corresponding data from row (accounting for skipped ID column)
                            let cellValue;
                            const dataColumns = tableHeadings.filter(h => h !== "Actions" && h !== "Gain & Loss");
                            const dataIndex = dataColumns.indexOf(heading);
                            
                            if (dataIndex !== -1) {
                              // Add 1 to account for skipped ID column (row[0])
                              cellValue = row[dataIndex + 1];
                            }
                            
                            if (cellValue === undefined) return null;
                            
                            // Skip if this heading was already shown in collapsed view
                            if (heading === tableHeadings[1]) return null; // Skip bank name as it's in header
                            
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
      </div>
    </div>
  );
};

export default BankAccountTable;