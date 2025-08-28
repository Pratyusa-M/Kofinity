// src/components/common/TransactionHistoryTable.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import EditTransactionModal from "./EditTransactionModal";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {Pencil, Trash2} from "lucide-react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import ConfirmDialog from "./ConfirmDeleteDialog";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import EditPLTransactionModal from "./EditPLTransactionModal";

export default function TransactionHistoryTable({
  tableHeadings,
  tableData,
  assetType,
  tickerName,
  currencySymbol,
  onRefresh,
  plType = null,
  id = null,
}) {
  const [editingRow, setEditingRow] = useState(null);
  const [toDeleteRow, setToDeleteRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [PLEditingRow, setPLEditingRow] = useState(null);
  const [PLToDeleteRow, setPLToDeleteRow] = useState(null);
  const [isPLDeleting, setIsPLDeleting] = useState(false);
  
  // Mobile accordion state
  const [expandedIndex, setExpandedIndex] = useState(null);

  const location = window.location.pathname;
  const isprofiltloss = location.includes("profitloss");

  const handleDeleteConfirm = async () => {
    if (!toDeleteRow) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${baseUrl}${assetType}/transaction/${toDeleteRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Transaction deleted");
      setIsDeleting(false);
      setTimeout(() => {
        onRefresh?.();
      }, 1000);
    } catch {
      toast.error("Failed to delete transaction");
      setIsDeleting(false);
    } finally {
      setToDeleteRow(null);
    }
  };

  const handlePLDeleteConfirm = async () => {
    if (!PLToDeleteRow) return;
    try {
      setIsPLDeleting(true);
      await axios.delete(`${baseUrl}profit-loss/delete/transactions-list?type=${plType}&id=${id}&transactionId=${PLToDeleteRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Transaction deleted");
      setIsPLDeleting(false);
      setTimeout(() => {
        onRefresh?.();
      }, 1000);
    } catch {
      toast.error("Failed to delete transaction");
      setIsPLDeleting(false);
    } finally {
      setPLToDeleteRow(null);
    }
  };

  // Helper function to get key information for mobile collapsed view
  const getKeyInfo = (row) => {
    if (isprofiltloss) {
      return {
        primary: `${currencySymbol}${row.price.toLocaleString()}`,
        secondary: row.date,
        tertiary: row.brokerageAccount
      };
    } else {
      return {
        primary: `${row.quantity} @ ${currencySymbol}${row.price.toLocaleString()}`,
        secondary: row.date,
        tertiary: row.transactionType === "sell" ? "Sold" : "Bought"
      };
    }
  };

  const renderDesktopTable = () => (
    <div className="hidden md:block relative overflow-x-auto rounded-lg bg-[#191919] max-h-[465px] overflow-y-auto">
      <table className="w-full border-separate border-spacing-y-2 text-white">
        <thead>
          <tr>
            {tableHeadings.map((h) => (
              <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length === 0 && (
            <tr>
              <td colSpan={tableHeadings.length} className="text-center py-20 text-white">
                No Transaction History Found
              </td>
            </tr>
          )}
          {isprofiltloss ? (
            tableData.map((row) => (
              <tr key={row.id} className="bg-[#1D1D1F]">
                <td className="px-6 py-4">{currencySymbol}{row.price.toLocaleString()}</td>
                <td className="px-6 py-4">{row.date}</td>
                <td className="px-6 py-4">{row.brokerageAccount}</td>
                <td className="px-6 py-4">{row.remarks}</td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <button onClick={() => setPLEditingRow(row)} className="hover:text-blue-400">
                    <Pencil className="w-4" />
                  </button>
                  <button onClick={() => setPLToDeleteRow(row)} className="hover:text-red-500">
                    <Trash2 className="w-4"/>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            tableData.map((row) => (
              <tr key={row.id} className="bg-[#1D1D1F]">
                <td className="px-6 py-4">{row.quantity}</td>
                <td className="px-6 py-4">{currencySymbol}{row.price.toLocaleString()}</td>
                <td className="px-6 py-4">{row.date}</td>
                <td className="px-6 py-4">{row.brokerageAccount}</td>
                {assetType === "crypto" && (<td className="px-6 py-4">{row.commission}</td>)}
                <td className="px-6 py-4 flex items-center gap-3">
                  <span className={
                    row.transactionType === "sell" ? "w-[5rem] text-red-400" : "w-[5rem] text-green-400"
                  }>
                    {row.transactionType === "sell" ? "Sold" : "Bought"}
                  </span>
                  {(assetType === "crypto" || assetType === "stocks") && (
                    <>
                      <button onClick={() => setEditingRow(row)} className="hover:text-blue-400">
                        <FaEdit size={16} />
                      </button>
                      <button onClick={() => setToDeleteRow(row)} className="hover:text-red-500">
                        <Trash2 className="w-4"/>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = () => (
    <div className="block md:hidden bg-[#191919] rounded-lg">
      {tableData.length === 0 ? (
        <div className="text-center py-20 text-white">
          No Transaction History Found
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {tableData.map((row, ridx) => {
            const isExpanded = expandedIndex === ridx;
            const keyInfo = getKeyInfo(row);
            
            return (
              <div key={row.id} className="bg-[#1D1D1F] rounded-lg overflow-hidden transition-all duration-200">
                {/* Collapsed Header - Always Visible */}
                <div className="px-3 py-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-base">
                        {keyInfo.primary}
                      </div>
                      <div className="text-[#A8A8A8] text-sm mt-1">
                        {keyInfo.secondary}
                      </div>
                      {!isExpanded && (
                        <div className={`text-sm mt-1 ${
                          isprofiltloss ? "text-white" : 
                          (row.transactionType === "sell" ? "text-red-400" : "text-green-400")
                        }`}>
                          {keyInfo.tertiary}
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

                  {/* Action Buttons - Always Visible */}
                  <div className="flex flex-wrap gap-2">
                    {isprofiltloss ? (
                      <>
                        <button
                          onClick={() => setPLEditingRow(row)}
                          className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded  text-xs transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-4" />
                         
                        </button>
                        <button
                          onClick={() => setPLToDeleteRow(row)}
                          className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded text-xs transition-colors flex items-center gap-1"
                        >
                          <FaTrash size={12} />
                         
                        </button>
                      </>
                    ) : (
                      assetType === "crypto" && (
                        <>
                          <button
                            onClick={() => setEditingRow(row)}
                            className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded  text-xs transition-colors flex items-center gap-1"
                          >
                            <Pencil className="w-4" />
                            
                          </button>
                          <button
                            onClick={() => setToDeleteRow(row)}
                            className="px-3 py-1 bg-[#2E2E2E] hover:bg-[#3A3A3C] rounded  text-xs transition-colors flex items-center gap-1"
                          >
                            <FaTrash size={12} />
                           
                          </button>
                        </>
                      )
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-[#2A2A2C] px-3 py-3 bg-[#1A1A1C]">
                    <div className="space-y-2">
                      {isprofiltloss ? (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">Price</span>
                            <span className="text-white text-sm">{currencySymbol}{row.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">Date</span>
                            <span className="text-white text-sm">{row.date}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">Brokerage Account</span>
                            <span className="text-white text-sm">{row.brokerageAccount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">Remarks</span>
                            <span className="text-white text-sm">{row.remarks}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">Quantity</span>
                            <span className="text-white text-sm">{row.quantity}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">Price</span>
                            <span className="text-white text-sm">{currencySymbol}{row.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">Date</span>
                            <span className="text-white text-sm">{row.date}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">Brokerage Account</span>
                            <span className="text-white text-sm">{row.brokerageAccount}</span>
                          </div>
                          {assetType === "crypto" && (
                            <div className="flex justify-between items-center">
                              <span className="text-[#A8A8A8] font-medium text-sm">Commission</span>
                              <span className="text-white text-sm">{row.commission}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-[#A8A8A8] font-medium text-sm">Type</span>
                            <span className={`text-sm ${
                              row.transactionType === "sell" ? "text-red-400" : "text-green-400"
                            }`}>
                              {row.transactionType === "sell" ? "Sold" : "Bought"}
                            </span>
                          </div>
                        </>
                      )}
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
      <ToastContainer />
      
      {/* Desktop Table */}
      {renderDesktopTable()}
      
      {/* Mobile Cards */}
      {renderMobileCards()}

      {/* Modals */}
      {editingRow && (
        <EditTransactionModal
          isOpen={!!editingRow}
          onRequestClose={() => setEditingRow(null)}
          transaction={editingRow}
          tickerName={tickerName}
          onRefresh={onRefresh}
          currency={editingRow.currency}
          onSave={(updated) => {
            setEditingRow(null);
          }}
          assetType={assetType}
        />
      )}
      
      {PLEditingRow && (
        <EditPLTransactionModal
          isOpen={PLEditingRow}
          onRequestClose={() => setPLEditingRow(null)}
          transaction={PLEditingRow}
          onRefresh={onRefresh}
          onSave={(updated) => {
            setPLEditingRow(null);
          }}
          plType={plType}
          id={id}
        />
      )}
      
      <ConfirmDialog
        isOpen={!!toDeleteRow}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setToDeleteRow(null)}
        isDeleting={isDeleting}
      />
      
      <ConfirmDialog
        isOpen={!!PLToDeleteRow}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onConfirm={handlePLDeleteConfirm}
        onCancel={() => setPLToDeleteRow(null)}
        isDeleting={isPLDeleting}
      />
    </div>
  );
}

TransactionHistoryTable.propTypes = {
  tableHeadings: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  assetType: PropTypes.string.isRequired,
  tickerName: PropTypes.string.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  onRefresh: PropTypes.func,
  plType: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};