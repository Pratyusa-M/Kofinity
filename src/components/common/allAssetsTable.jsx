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

const AllAssetsTable = ({
  tableHeadings,
  tableData,
  tableProps,
  profit,
  profitPercent,
  assetValue,
}) => {
  console.log("tableData", tableData);
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

  const checkPercentValue = (percentageString) => {
    const intValue = parseInt(percentageString.replace("%", ""), 10);
    return intValue < 0;
  };

  const navigateToRespectiveAsset = (assetName) => {
    if (assetName === "Stocks") {
      navigate("/stocks");
    } else if (assetName === "Real Estate") {
      navigate("/realestate");
    } else if (assetName === "Other Assets") {
      navigate("/otherassets");
    } else if (assetName === "Bank account") {
      navigate("/bankaccount");
    } else if (assetName === "Crypto") {
      navigate("/crypto");
    }
  };

  // Helper function to determine which headings should be shown in collapsed view
  const getCollapsedHeadings = (headings) => {
    // Always show the asset name (usually first column)
    const collapsedHeadings = new Set([0]); // First column (asset name)
    
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
                    <tr
                      className="bg-[#1D1D1F] cursor-pointer"
                      key={idx}
                      onClick={() => navigateToRespectiveAsset(row[0])}
                    >
                      {row?.slice(0, row.length - 2).map((data, index) => (
                        <td
                          key={index}
                          className="px-[24px] py-[16px] text-[#F6F8FB] font-[400] text-base leading-[24px] tracking-[0.15px]"
                        >
                          {data}
                        </td>
                      ))}
                      
                      {/* Gain & Loss */}
                      {tableHeadings.includes("Gain & Loss") && (
                        <td className="px-[24px] py-[16px]">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex w-36  items-center text-[16px] text-roboto ${
                                checkPercentValue(row[row.length - 1])
                                  ? "text-[#B91F1F]"
                                  : "text-[#1FB98B]"
                              } font-[400]`}
                            >
                              {selectedCurencySymbol}
                              {row[row.length - 2]}
                            </div>
                            <div
                              className={`flex justify-center items-center text-[10px] text-lato ml-5 ${
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
                        </td>
                      )}
                      
                      {/* Actions */}
                      {tableHeadings.includes("Actions") && (
                        <td className="px-[24px] py-[16px]">
                          <div className="flex gap-1 justify-center items-center">
                            {tableHeadings.length === 8 && (
                              <div className="w-[17px] h-[16px] bg-[#2E2E2E] flex justify-center items-center rounded-full cursor-pointer">
                                <img
                                  className="w-[8.79px] h-[8.7px]"
                                  src={tableplus}
                                  alt="+"
                                />
                              </div>
                            )}
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
                            {row[0]} {/* Asset name */}
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
                          onClick={() => navigateToRespectiveAsset(row[0])}
                          className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                        >
                          View Details
                        </button>
                        
                        {/* Conditional action buttons based on table type */}
                       
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-[#2A2A2C] px-3 py-3 bg-[#1A1A1C]">
                        <div className="space-y-2">
                          {tableHeadings.map((heading, hidx) => {
                            // Skip Actions column
                            if (heading === "Actions") return null;
                            
                            // Skip headings that were already shown in collapsed view
                            if (collapsedHeadings.has(hidx)) return null;
                            
                            // Get the corresponding data from row
                            let cellValue;
                            if (heading === "Gain & Loss") {
                              // Skip - will be handled separately below
                              return null;
                            } else {
                              // For regular data columns, map heading index to row data
                              const dataColumns = tableHeadings.filter(h => h !== "Actions");
                              const dataIndex = dataColumns.indexOf(heading);
                              if (dataIndex !== -1 && dataIndex < row.length - 2) {
                                cellValue = row[dataIndex];
                              }
                            }
                            
                            if (cellValue === undefined) return null;
                            
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

export default AllAssetsTable;