/* eslint-disable no-unused-vars */
import AssetLayout from "../../components/layout/assetsLayout";
import MarketPriceHistoryTable from "../../components/common/marketPriceHistoryTable";
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

const tableHeadings = ["Market Price", "Market Value's Date"];

const tableData = [
  [400, "01/08/2024"],
  [300, "01/08/2024"],
];

const MarketPriceHistory = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [isTableLoading, setTableLoading] = useState(false);

  const location = useLocation();
  const historyId = location?.state?.transHistoryId;
  const route = location?.state?.transRoute;
  const apiRoute = location?.state?.apiRoute;
  const tickerName = location?.state?.tickerName;

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

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
    const tableData = data.map((item) => [
      // item?.id,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.market_price)}`,
      `${formatDate(item?.market_price_date)}`,
    ]);

    setTransactionData(tableData);
  };

  const getTransactionsData = async () => {
    setTableLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}${apiRoute}/market-price/history/${historyId}?desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (apiRoute === "real-estate") {
        convertTransactionsData(response?.data?.data?.realEstateHistory);
      } else if (apiRoute === "other-asset") {
        convertTransactionsData(response?.data?.data?.otherAssetHistory);
      }
      setTableLoading(false);
    } catch (error) {
      setTransactionData([]);
      console.log(error.message);
      setTableLoading(false);
    }
  };

  const chartLoading = () => {
    return (
      <div className="w-[100%] h-[250px] flex justify-center items-center bg-[#191919] rounded-[4px]">
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
      heading={tickerName}
      isSellAssets={true}
      closeRoute={route || "/allassets"}
      jsxProp={
        <div className="flex flex-col gap-10">
          <h1 className="text-[#FFFFFF] text-roboto text-[24px] font-[500]">
            Market Price History
          </h1>
          {!isTableLoading ? (
            <MarketPriceHistoryTable
              tableProps={tableProps}
              tableHeadings={tableHeadings}
              tableData={transactionData}
              //   tableData={tableData}
            />
          ) : (
            chartLoading()
          )}
        </div>
      }
    />
  );
};

export default MarketPriceHistory;
