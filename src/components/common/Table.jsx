/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Arrow1 from "../../assets/arrow1.svg";
import arrow2 from "../../assets/arrow2.svg";
import tableplus from "../../assets/tableplus.png";
import tableminus from "../../assets/tableminus.svg";
import tabledit from "../../assets/tabledit.svg";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FormatNumberWithCommas } from "./commaSeparatedNumbers";
import { useDispatch, useSelector } from "react-redux";
import {
  setRealEstateName,
  selectedRealEstateName,
} from "../../redux/store/slice/portfolioSlice";
import { SelectedCurrencySymbol } from "../../redux/store/slice/currencySlice";
import {
  Ban,
  Pencil,
  History,
  CirclePlus,
  CircleMinus,
  Trash2,
} from "lucide-react";

const Table = ({
  tableHeadings,
  tableData,
  tableProps,
  profit,
  profitPercent,
  assetValue,
  profitLoss = false,
  onDeleteItem,
  onNavigatetoEditTransaction,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const selectedRealEstName = useSelector(selectedRealEstateName);
  const selectedCurrencySymbol = useSelector(SelectedCurrencySymbol);
  console.log("tableData", tableData);
  // State for accordion
  const [expandedIndex, setExpandedIndex] = useState(null);

  const onNavigateToTransactionsHistory = (id, tickerName, type) => {
    console.log("type", type);
    if (location.pathname === "/pl") {
      navigate("/profitloss-transactionhistory", {
        state: { id, transRoute: "/pl", type, apiRoute: "profit-loss" },
      });
    } else if (location.pathname === "/stocks") {
      navigate("/transactionhistory", {
        state: {
          transHistoryId: id,
          transRoute: "/stocks",
          apiRoute: "stocks",
          tickerName,
        },
      });
    } else if (location.pathname === "/crypto") {
      navigate("/transactionhistory", {
        state: {
          transHistoryId: id,
          transRoute: "/crypto",
          apiRoute: "crypto",
          tickerName,
        },
      });
    } else if (location.pathname === "/realestate") {
      navigate("/marketpricehistory", {
        state: {
          transHistoryId: id,
          transRoute: "/realestate",
          apiRoute: "real-estate",
          tickerName,
        },
      });
    } else if (location.pathname === "/otherassets") {
      navigate("/marketpricehistory", {
        state: {
          transHistoryId: id,
          transRoute: "/otherassets",
          apiRoute: "other-asset",
          tickerName,
        },
      });
    }
  };

  const onNavigateToBuyAssets = (id, name) => {
    if (location.pathname === "/realestate") {
      navigate("/buyrealestate", { state: { buyId: id } });
    } else if (location.pathname === "/bankaccount") {
      navigate("/buybankaccount", { state: { buyId: id } });
    } else if (location.pathname === "/otherassets") {
      navigate("/buyotherassets", { state: { buyId: id } });
    } else if (location.pathname === "/stocks") {
      navigate("/buystock", { state: { buyId: id, buyName: name } });
    } else if (location.pathname === "/crypto") {
      navigate("/buycrypto", { state: { buyId: id, buyName: name } });
    }
  };

  const onNavigateToSellAssets = (id, name) => {
    if (location.pathname === "/realestate") {
      navigate("/sellrealestate", { state: { sellId: id, sellName: name } });
    } else if (location.pathname === "/bankaccount") {
      navigate("/bankclosure", { state: { sellId: id, sellName: name } });
    } else if (location.pathname === "/otherassets") {
      navigate("/sellotherassets", { state: { sellId: id, sellName: name } });
    } else if (location.pathname === "/stocks") {
      navigate("/sellstock", { state: { sellId: id, sellName: name } });
    } else if (location.pathname === "/crypto") {
      navigate("/sellcrypto", { state: { sellId: id, sellName: name } });
    }
  };

  const onEditAssets = (id, name) => {
    if (location.pathname === "/realestate") {
      navigate("/editrealestate1", { state: { editId: id, editName: name } });
      dispatch(setRealEstateName(name));
      localStorage.setItem("editid", id);
    } else if (location.pathname === "/bankaccount") {
      navigate("/editbankaccount", { state: { editId: id, editName: name } });
    } else if (location.pathname === "/otherassets") {
      navigate("/editotherassets", { state: { editId: id, editName: name } });
    } else if (location.pathname === "/stocks") {
      navigate("/editStocks", { state: { editId: id, editName: name } });
    } else if (location.pathname === "/crypto") {
      navigate("/editcrypto", { state: { editId: id, editName: name } });
    }
  };

  const onUpdateMarketValue = (id, name) => {
    if (location.pathname === "/otherassets") {
      navigate("/updatemarketvalue1", {
        state: { marketId: id, marketName: name },
      });
    } else if (location.pathname === "/realestate") {
      navigate("/updatemarketvalue2", {
        state: { marketId: id, marketName: name },
      });
    }
  };

  const checkPercentValue = (percentageString) => {
    const intValue = parseInt(percentageString?.replace("%", ""), 10);
    return intValue < 0;
  };

  // Helper function to determine which headings should be shown in collapsed view
  const getCollapsedHeadings = (headings) => {
    // Always show the asset name (usually first data column)
    const collapsedHeadings = new Set([0]); // First data column (asset name)

    // Add Gain & Loss to collapsed view if it exists
    const gainLossIndex = headings.findIndex((h) => h === "Gain & Loss");
    if (gainLossIndex !== -1) {
      collapsedHeadings.add(gainLossIndex);
    }

    return collapsedHeadings;
  };

  return (
    <div className="relative text-roboto bg-[#191919] rounded-lg shadow-md">
      {/* Title & KPI */}
      <div className="p-6">
        <h2 className="text-white text-lg font-semibold">
          {tableProps?.title}
        </h2>
        {!profitLoss && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="text-white text-2xl font-normal">
              {selectedCurrencySymbol}
              {FormatNumberWithCommas(assetValue || 0)}
            </div>
            <div
              className={`text-base font-normal ${
                profitPercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
              }`}
            >
              {selectedCurrencySymbol}
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
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-y-auto max-h-[465px]">
        <table className="w-full table-auto border-separate border-spacing-y-2 mb-2">
          <thead>
            <tr>
              {tableHeadings.map((heading, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2 text-left text-base font-medium text-white"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, ridx) => (
              <tr key={ridx} className="bg-[#1D1D1F]">
                {/* Data Cells */}
                {console.log("row", row)}
                {row.slice(1, row.length - 2).map((cell, cidx) => (
                  <td
                    key={cidx}
                    className="px-4 py-2 text-white text-base cursor-pointer"
                    onClick={() =>
                      onNavigateToTransactionsHistory(row[0], row[1], row[8])
                    }
                  >
                    {cell}
                  </td>
                ))}

                {/* Gain & Loss */}
                {tableHeadings.includes("Gain & Loss") && (
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-lg w-32 font-normal ${
                          checkPercentValue(row[row.length - 1])
                            ? "text-[#B91F1F]"
                            : "text-[#1FB98B]"
                        }`}
                      >
                        {row[row.length - 2]}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-normal">
                        <span
                          className={
                            checkPercentValue(row[row.length - 1])
                              ? "text-[#B91F1F]"
                              : "text-[#1FB98B]"
                          }
                        >
                          {row[row.length - 1]}
                        </span>
                        <img
                          src={
                            checkPercentValue(row[row.length - 1])
                              ? arrow2
                              : Arrow1
                          }
                          alt="arrow"
                        />
                      </div>
                    </div>
                  </td>
                )}

                {/* Actions */}
                {tableHeadings.includes("Actions") && (
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2 ">
                      {!profitLoss && (
                        <>
                          {location.pathname !== "/realestate" &&
                            location.pathname !== "/otherassets" && (
                              <div
                                onClick={() =>
                                  onNavigateToBuyAssets(row[0], row[1])
                                }
                                className="p-2 bg-[#2E2E2E] rounded-full cursor-pointer"
                              >
                                <img src={tableplus} alt="buy" />
                              </div>
                            )}
                          <div
                            onClick={() =>
                              onNavigateToSellAssets(row[0], row[1])
                            }
                            className=" flex justify-center items-center w-[24px] h-[23px] bg-[#2E2E2E] rounded-full cursor-pointer"
                          >
                            <img src={tableminus} alt="sell" />
                          </div>
                          {location.pathname !== "/crypto" &&
                            location.pathname !== "/stocks" && (
                              <div
                                onClick={() => onEditAssets(row[0], row[1])}
                                className=" flex justify-center items-center w-[24px] h-[23px] bg-[#2E2E2E] rounded-full cursor-pointer"
                              >
                                <img src={tabledit} alt="edit" />
                              </div>
                            )}
                        </>
                      )}
                      {profitLoss && (
                        <>
                          <div
                            onClick={() =>
                              onNavigatetoEditTransaction(row[0], row[1])
                            }
                            className="p-2 bg-[#2E2E2E] rounded-full cursor-pointer"
                          >
                            <FaEdit className="text-white" />
                          </div>
                          <div
                            onClick={() => onDeleteItem(row[0], row[1])}
                            className="p-2 bg-[#2E2E2E] rounded-full cursor-pointer"
                          >
                            <FaTrash className="text-white" />
                          </div>
                        </>
                      )}
                       {(location.pathname === "/realestate" || location.pathname === "/otherassets") && (
                     <button
                                onClick={() =>
                                  onUpdateMarketValue(row[0], row[1])
                                }
                                className="w-[24px] h-[23px] flex justify-center items-center bg-[#2E2E2E] rounded-full cursor-pointer"
                              >
                                <FaEdit className="w-[10px] h-[10px]" />
                              </button>
                    )}
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
            <div
              key={ridx}
              className="bg-[#1D1D1F] rounded-lg overflow-hidden transition-all duration-200"
            >
              {/* Collapsed Header - Always Visible */}
              <div className="px-3 py-3">
                {/* Key Information */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-base truncate">
                      {row[1]} {/* Asset name */}
                    </div>

                    {/* Show Gain/Loss if present and not expanded */}
                    {!isExpanded && tableHeadings.includes("Gain & Loss") && (
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-sm font-medium ${
                            checkPercentValue(row[row.length - 1])
                              ? "text-[#B91F1F]"
                              : "text-[#1FB98B]"
                          }`}
                        >
                          {row[row.length - 2]}
                        </span>
                        <span
                          className={`text-xs ${
                            checkPercentValue(row[row.length - 1])
                              ? "text-[#B91F1F]"
                              : "text-[#1FB98B]"
                          }`}
                        >
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
                    onClick={() =>
                      onNavigateToTransactionsHistory(row[0], row[1], row[8])
                    }
                    className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                  >
                    <History className="w-4" />
                  </button>

                  {!profitLoss && (
                    <>
                      {location.pathname !== "/realestate" &&
                        location.pathname !== "/otherassets" && (
                          <button
                            onClick={() =>
                              onNavigateToBuyAssets(row[0], row[1])
                            }
                            className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                          >
                            <CirclePlus className="w-4" />
                          </button>
                        )}
                      <button
                        onClick={() => onNavigateToSellAssets(row[0], row[1])}
                        className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                      >
                        <CircleMinus className="w-4" />
                      </button>
                    </>
                  )}

                  {profitLoss && (
                    <button
                      onClick={() =>
                        onNavigatetoEditTransaction(row[0], row[1])
                      }
                      className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                    >
                      <Pencil className="w-4" />
                    </button>
                  )}
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
                      // The row data starts from index 1 (skipping the ID at index 0)
                      // But for Gain & Loss, we need special handling as it uses the last two elements
                      let cellValue;
                      if (heading === "Gain & Loss") {
                        // Skip - will be handled separately below
                        return null;
                      } else {
                        // For regular data columns, map heading index to row data
                        // Account for the fact that row[0] is ID, and last elements might be special
                        const dataColumns = tableHeadings.filter(
                          (h) => h !== "Actions"
                        );
                        const dataIndex = dataColumns.indexOf(heading);
                        if (dataIndex !== -1) {
                          cellValue = row[dataIndex + 1]; // +1 because row[0] is ID
                        }
                      }

                      if (cellValue === undefined) return null;

                      return (
                        <div
                          key={hidx}
                          className="flex justify-between items-center"
                        >
                          <span className="text-[#A8A8A8] font-medium text-sm">
                            {heading}
                          </span>
                          <span className="text-white text-sm">
                            {cellValue}
                          </span>
                        </div>
                      );
                    })}

                    {/* Show Gain & Loss in expanded view if not already shown in collapsed */}
                    {tableHeadings.includes("Gain & Loss") && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#A8A8A8] font-medium text-sm">
                          Gain & Loss
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              checkPercentValue(row[row.length - 1])
                                ? "text-[#B91F1F]"
                                : "text-[#1FB98B]"
                            }`}
                          >
                            {row[row.length - 2]}
                          </span>
                          <div className="flex items-center gap-1">
                            <span
                              className={`text-xs ${
                                checkPercentValue(row[row.length - 1])
                                  ? "text-[#B91F1F]"
                                  : "text-[#1FB98B]"
                              }`}
                            >
                              {row[row.length - 1]}
                            </span>
                            <img
                              src={
                                checkPercentValue(row[row.length - 1])
                                  ? arrow2
                                  : Arrow1
                              }
                              alt="trend"
                              className="w-3 h-3"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Actions in Expanded View */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#2A2A2C]">
                    {!profitLoss &&
                      location.pathname !== "/crypto" &&
                      location.pathname !== "/stocks" && (
                        <button
                          onClick={() => onEditAssets(row[0], row[1])}
                          className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-white text-xs transition-colors"
                        >
                          <Pencil className="w-4" />
                        </button>
                      )}

                    {profitLoss && (
                      <button
                        onClick={() => onDeleteItem(row[0], row[1])}
                        className="px-3 py-1 bg-[#B91F1F] hover:bg-[#A01B1B] rounded text-white text-xs transition-colors"
                      >
                        <Trash2 className="w-4" />
                      </button>
                    )}
                    {(location.pathname === "/realestate" || location.pathname === "/otherassets") && (
                     <button
                                onClick={() =>
                                  onUpdateMarketValue(row[0], row[1])
                                }
                                className="px-3 py-1 flex justify-center items-center bg-[#2E2E2E] rounded cursor-pointer"
                              >
                                <FaEdit className="w-4" />
                              </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Table;
