/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
/* eslint-disable react/prop-types */
import { useState } from "react";
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

const BankTransactionHistoryTable = ({ tableHeadings, tableData }) => {
  console.log("tableData", tableData);
  console.log("tableHeadings", tableHeadings);
  
  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const checkPercentValue = (percentageString) => {
    const intValue = parseInt(percentageString.replace("%", ""), 10);
    return intValue < 0;
  };

  // Helper function to get key information for mobile collapsed view
  const getKeyInfo = (row) => {
    // Assuming common bank transaction structure
    // Adjust these indices based on your actual table structure
    const amount = row.find(item => 
      typeof item === 'string' && (item.includes('$') || item.includes('€') || item.includes('₹') || /^\d+\.?\d*$/.test(item))
    ) || row[1];
    
    const transactionType = row.find(item => 
      typeof item === 'string' && (item.toLowerCase() === 'credit' || item.toLowerCase() === 'debit')
    ) || row[2];
    
    const date = row.find(item => 
      typeof item === 'string' && /\d{1,2}\/\d{1,2}\/\d{4}/.test(item)
    ) || row[0];

    return {
      primary: amount,
      secondary: date,
      tertiary: transactionType,
      description: row[3] || row[row.length - 1] // Often description is last or at index 3
    };
  };

  // Get text color based on transaction type
  const getTextColor = (data) => {
    if (String(data).trim().toLowerCase() === "credit") return "text-[#00B74A]";
    if (String(data).trim().toLowerCase() === "debit") return "text-[#F93154]";
    return "text-[#F6F8FB]";
  };

  const renderDesktopTable = () => (
    <div className="hidden md:block relative text-roboto overflow-x-auto shadow-md sm:rounded-lg bg-[#191919] rounded-[4px] max-h-[465px] overflow-y-auto">
      {tableData.length >= 1 ? (
        <div>
          <table className="w-full text-roboto border-separate border-spacing-y-[10px] mb-2 table-auto">
            <thead className="">
              <tr>
                {tableHeadings?.map((heading, idx) => {
                  return (
                    <th
                      key={idx}
                      scope="col"
                      className="px-[24px] py-[16px] text-start text-base font-[500] text-[#FFFFFF] leading-[20px]"
                    >
                      <p className="">{heading}</p>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tableData?.map((row, idx) => {
                return (
                  <tr className="bg-[#1D1D1F] cursor-pointer" key={idx}>
                    {row?.map((data, index) => {
                      return (
                        <td
                          key={index}
                          className={`px-[24px] py-[16px] font-[400] text-base leading-[24px] tracking-[0.15px] ${getTextColor(data)}`}
                        >
                          {data}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-[#ffffff] text-[22px] text-roboto mb-3 font-[400] h-[150px] flex justify-center items-center">
          No Data Found
        </div>
      )}
    </div>
  );

  const renderMobileCards = () => (
    <div className="block md:hidden bg-[#191919] rounded-[4px] shadow-md">
      {tableData.length === 0 ? (
        <div className="text-center text-[#ffffff] text-[22px] text-roboto mb-3 font-[400] h-[150px] flex justify-center items-center">
          No Data Found
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {tableData.map((row, ridx) => {
            const isExpanded = expandedIndex === ridx;
            const keyInfo = getKeyInfo(row);
            
            return (
              <div key={ridx} className="bg-[#1D1D1F] rounded-lg overflow-hidden transition-all duration-200">
                {/* Collapsed Header - Always Visible */}
                <div className="px-3 py-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-base ${getTextColor(keyInfo.primary)}`}>
                        {keyInfo.primary}
                      </div>
                      <div className="text-[#A8A8A8] text-sm mt-1">
                        {keyInfo.secondary}
                      </div>
                      {!isExpanded && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-sm font-medium ${getTextColor(keyInfo.tertiary)}`}>
                            {keyInfo.tertiary}
                          </span>
                          {keyInfo.description && (
                            <span className="text-[#A8A8A8] text-xs truncate">
                              {keyInfo.description}
                            </span>
                          )}
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
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-[#2A2A2C] px-3 py-3 bg-[#1A1A1C]">
                    <div className="space-y-2">
                      {tableHeadings.map((heading, hidx) => {
                        const cellValue = row[hidx];
                        if (cellValue === undefined || cellValue === null) return null;
                        
                        return (
                          <div key={hidx} className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">{heading}</span>
                            <span className={`text-sm ${getTextColor(cellValue)}`}>
                              {cellValue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Desktop Table */}
      {renderDesktopTable()}
      
      {/* Mobile Cards */}
      {renderMobileCards()}
    </div>
  );
};

export default BankTransactionHistoryTable;