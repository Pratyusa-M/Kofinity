/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";
import BankTransactionHistoryTable from "../../components/common/bankTransactionHistoryTable";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { FormatNumberWithCommas } from "../../components/common/commaSeparatedNumbers";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectedCurrencySymbol,
  selectedMainCurrencyId,
} from "../../redux/store/slice/currencySlice";

const tableProps = {
  title: "All Assets",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tableHeadings = [
  "Account type",
  "Transaction Amount",
  "Transaction Date",
  "Running Balance",
  "Transaction Type"
];


const BankTransactionHistory = () => {
  const [isTableLoading, setTableLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);

  const location = useLocation();
  const historyId = location?.state?.bankTransHistoryId;
  const route = location?.state?.bankTransRoute;
  const bankName = location?.state?.bankName;

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);
console.log("transactionData", transactionData);
  useEffect(() => {
    getTransactionsData();
  }, []);

  function formatDate(inputDate) {
    // Create a new Date object from the input string
    const date = new Date(inputDate);

    // Get day, month, and year from the date object
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    // Combine day, month, and year with '/' separator
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  const convertTransactionsData = (data) => {
  if (!Array.isArray(data)) return;

  const tableData = data.map((item) => [
    item?.account_type ?? "",
    `${selectedCurencySymbol}${FormatNumberWithCommas(item?.amount)}`,
    formatDate(item?.date),
    `${selectedCurencySymbol}${FormatNumberWithCommas(item?.balance?.toString())}`,
    item?.type ?? "",
  ]);

  setTransactionData(tableData);
};


  const getTransactionsData = async () => {
    setTableLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}bank-account/transactions/${historyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      convertTransactionsData(response?.data?.data?.data);
      console.log("response", response?.data?.data.data);
      setTableLoading(false);
    } catch (error) {
      console.log(error.message);
      setTableLoading(false);
    }
  };

  const chartLoading = () => {
    return (
      <div className="w-[100%] h-[150px] flex justify-center items-center bg-[#191919] rounded-[4px]">
        <TailSpin
          height="40"
          width="40"
          color="white"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  };

  return (
    <AssetLayout
      heading={bankName}
      isSellAssets={true}
      closeRoute={route || "/allassets"}
      jsxProp={
        <div className="flex flex-col gap-10">
          <h1 className="text-[#FFFFFF] text-roboto text-[24px] font-[500]">
            Transaction History
          </h1>
          {!isTableLoading ? (
            <BankTransactionHistoryTable
              tableProps={tableProps}
              tableHeadings={tableHeadings}
              tableData={transactionData}
            />
          ) : (
            chartLoading()
          )}
        </div>
      }
    />
  );
};

export default BankTransactionHistory;
