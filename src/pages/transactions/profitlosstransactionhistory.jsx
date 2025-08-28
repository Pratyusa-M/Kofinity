// src/pages/TransactionHistoryPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AssetLayout from "../../components/layout/assetsLayout";
import TransactionHistoryTable from "../../components/common/transactionHistoryTable";
import { baseUrl } from "../../utils/baseUrl";
import { useSelector } from "react-redux";
import {
  SelectedCurrencySymbol,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";
import { TailSpin } from "react-loader-spinner";

export default function TransactionHistoryPage() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedCurrencyId = useSelector(selectedMainCurrencyId);
  const selectedCurrencySymbol = useSelector(SelectedCurrencySymbol);

  const { state } = useLocation();
  const { apiRoute, id, type, transRoute } = state;

  function formatDate(d) {
    const date = new Date(d);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }

  const getTransactionsData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}${apiRoute}/transactions-lists?type=${type}&id=${id}&desiredCurrency=${selectedCurrencyId}`,
        { headers: { Authorization: `Bearer ${localStorage.token}` } }
      );
      console.log("res", res.data.data);
      const raw = res.data.data.transactions;
      console.log("raw", raw);

      const shaped = raw.map((item) => {
        const acct = item.bankAccount || {};
        const numStr =
          acct.account_number != null ? String(acct.account_number) : "";
        const censored =
          numStr.length >= 4
            ? `****${numStr.slice(-4)}`
            : numStr
            ? `****${numStr}`
            : "";

        return {
          id: item.id ?? item.transaction_id,
          price:
            item.amount,
          date: formatDate(
            item.date
          ),
          brokerageAccount: `${acct.account_name || ""}  ${censored}`,
          remarks: item.type,
        };
      });

      setTableData(shaped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [apiRoute, id, selectedCurrencyId]);

  useEffect(() => {
    getTransactionsData();
  }, [getTransactionsData]);

  console.log("tableData", tableData);
  return (
    <AssetLayout
      heading={"Profit/Loss"}
      isSellAssets
      closeRoute={transRoute || "/allassets"}
      jsxProp={
        loading
          ? <div className="flex justify-center items-center w-full h-full"><TailSpin
                        height="40"
                        width="40"
                        color="white"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                      /></div>
          : <TransactionHistoryTable
              tableHeadings={["Price","Date","Bank","Remarks"]}
              tableData={tableData}
              assetType={apiRoute}
              tickerName={"Profit/Loss"}
              currencySymbol={selectedCurrencySymbol}
              onRefresh={getTransactionsData}
              plType={type}
              id={id}
            />
      }
    />
  );
}
