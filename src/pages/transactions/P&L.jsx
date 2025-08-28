/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";

import PLChart from "../../components/transactions/PLChart";
import PLAnalysisBarChart from "../../components/transactions/PLAnalysisBarChart";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { TailSpin } from "react-loader-spinner";
import Breadcrumbs from "../../components/common/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from "../../redux/store/slice/currencySlice";
import Table from "../../components/common/Table";
import NoDataFoundTable from "../../components/common/noDataFoundTable";
import { FormatNumberWithCommas } from "../../components/common/commaSeparatedNumbers";
import moment from "moment";
const items = [{ label: "Financials > P&L", link: "./" }];

const PLPage = () => {
  const [tpId1, setTpId1] = useState(4);
  const [tpId2, setTpId2] = useState(4);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChartLoading, setChartLoading] = useState(false);
  const [isChartLoading2, setChartLoading2] = useState(false);
  const [plData, setPlData] = useState([]);
  const [plBarData, setPlBarData] = useState([]);
  const [PlValue, setPlValue] = useState("");
  const [plValuePercent, setPlValuePercent] = useState("");
  const [PlProfit, setPlProfit] = useState();
  const [intervalText1, setIntervalText1] = useState("year");
  const [intervalText2, setIntervalText2] = useState("year");
const [transactionsData, setTransactionsData] = useState([]);

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  useEffect(() => {
    getPlChartData();
    // getPLAnalysysChartData("year");
    // getNetProfitLossValue();
  }, [selectedCurrencyId, intervalText1]);

  useEffect(() => {
    getPLAnalysysChartData();
  }, [selectedCurrencyId, intervalText2]);

  useEffect(() => {
    getTransactionsData();
  }, [selectedCurrencyId]);

  const convertTransactionsData = (data) => {
    console.log("data", data);
    const tableTransactionsData = data?.map((item) => [
      item?.id,
      `${item?.description ?? ""}`,
      `${item?.payment_frequency ?? ""}`,
      `${moment(item?.start_date).format("DD/MM/yyyy")}`,
      `${moment(item?.end_date).format("DD/MM/yyyy")}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.amount ?? 0)}`,
      `${item?.no_of_occurrence ?? ""}`,
      `${item?.asset_type ?? ""}`,
      `${item?.type ?? ""}`,
      "",
      "",

    ])
    setTransactionsData(tableTransactionsData);
  };
    

  const getTransactionsData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}profit-loss/transactions?type=all&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data?.data?.transactions;
      convertTransactionsData(data);
     
    } catch (error) {
      console.log(error.message);
      setTransactionsData([]);
    }
  };



  const getNetProfitLossValue = async (interval) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}user-assets/history?interval=oneDay`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPlProfit(response?.data?.data?.data[0]?.net_profit_loss);
    } catch (error) {
      console.log(error.message);
    }
  };

  const convertAllAssetsChartData = (data, interval) => {
    if (interval === "month") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.monthName?.slice(0, 3),
        net_profit_loss: item?.data?.net_profit_loss || 0,
      }));
      setPlData(modifiedData);
    } else if (interval === "week") {
      const modifiedData = data?.map((item) => ({
        year: item?.start_date,
        net_profit_loss: item?.data?.net_profit_loss || 0,
      }));
      setPlData(modifiedData);
    } else if (interval === "quarter") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.quarterName,
        net_profit_loss: item?.data?.net_profit_loss || 0,
      }));
      setPlData(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year,
        net_profit_loss: item?.data?.net_profit_loss || 0,
      }));

      setPlData(modifiedData);
    }
  };

 const convertResultData = (data) => {
  const labelMap = {
    netProfitLoss:      "Total Cashflow",
    stockProfitLoss:    "Stocks",
    realEstateProfitLoss:"Real Estate",
    cryptoProfitLoss:   "Crypto",
    bankAccountProfitLoss:"Bank Account",
    otherAssetProfitLoss: "Other Assets",
  };

  const transformedData = Object.entries(data).map(([key, value]) => {
    const uv = value < 0 ? value : 0;
    const pv = value >= 0 ? value : 0;

    const label = labelMap[key] ?? key;

    return { uv, pv, label };
  });

  setPlBarData(transformedData);
};

  const getPLAnalysysChartData = async () => {
    setChartLoading2(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}income/netProfitLoss/history?interval=${intervalText2}&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const allData = response?.data?.data;
      const {
        netProfitLoss,
        stockProfitLoss,
        otherAssetProfitLoss,
        realEstateProfitLoss,
        cryptoProfitLoss,
        bankAccountProfitLoss,
        ...resultData
      } = allData;

      convertResultData({
        netProfitLoss,
        stockProfitLoss,
        realEstateProfitLoss,
        cryptoProfitLoss,
        bankAccountProfitLoss,
        otherAssetProfitLoss,
      });
      setChartLoading2(false);
    } catch (error) {
      setPlBarData([]);
      setChartLoading2(false);
      console.log(error.message);
    }
  };

  const getPlChartData = async () => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}income/netProfitLoss/history?interval=${intervalText1}&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      convertAllAssetsChartData(response?.data?.data?.data, intervalText1);
      setPlProfit(response?.data?.data?.netProfitLoss);
      setPlValue(response?.data?.data?.profitLoss?.totalProfitLoss);
      setPlValuePercent(
        response?.data?.data?.profitLoss?.totalProfitLossPercent
      );
      setChartLoading(false);
    } catch (error) {
      setPlData([]);
      setPlProfit(0);
      setPlValue(0);
      setPlValuePercent(0);
      setChartLoading(false);
      console.log(error.message);
    }
  };

  const timePeriod1 = [
    { id: 1, tp: "Week", interval: "week" },
    { id: 2, tp: "Month", interval: "month" },
    { id: 3, tp: "Quarter", interval: "quarter" },
    { id: 4, tp: "Year", interval: "year" },
  ];

  const timePeriod2 = [
    { id: 1, tp: "Week", interval: "week" },
    { id: 2, tp: "Month", interval: "month" },
    { id: 3, tp: "Quarter", interval: "quarter" },
    { id: 4, tp: "Year", interval: "year" },
  ];

  const RadioTypeData = [
    { id: 1, data: "Total Cashflow" },
    { id: 2, data: "Stocks" },
    { id: 3, data: "Real Estate" },
    { id: 4, data: "Crypto" },
    { id: 5, data: "Bank Account" },
    { id: 6, data: "Other Assets" },
  ];

  const tableHeadingsTransactions = [
    "Name",
    "Payment frequency",
    "Start date",
    "End date",
    "Amount",
    "No of occurrences",
    "Asset type",
    "Type",
  ];

  const onSelectTp1 = (each) => {
    if (each?.id !== tpId1) {
      setTpId1(each.id);
      setIntervalText1(each.interval);
      // getPlChartData(each.interval);
    }
  };

  const onSelectTp2 = (each) => {
    if (each?.id !== tpId2) {
      setTpId2(each.id);
      setIntervalText2(each.interval);
      // getPLAnalysysChartData(each.interval);
    }
  };

  const handleOptionChange = (each) => {
    setSelectedOption(each.id);
  };

  const chartLoading = () => {
    return (
      <div className="w-[100%] h-[403px] flex justify-center items-center">
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
    <div className="h-full w-full flex flex-col  items-center text-4xl text-roboto font-[600] text-white bg-black">
      <Header items={items} />
      <div className="self-start ml-6 -mb-8 md:-mb-5 md:mt-3">
        <Breadcrumbs items={items} />
      </div>
      <div className=" w-full flex flex-col gap-[32px] mt-[32px] px-[5px] md:pl-[24px] md:pr-[28px] pb-[82px]">
        <div className=" bg-[#191919] h-[100%] w-[100%] rounded p-[10px] pt-0 md:pt-[24px] md:p-[24px]">
          <p className="text-roboto font-[500] px-2 text-[16px] text-[#F6F8FB] md:mb-[12px]">
            Net P&L
          </p>
          {!isChartLoading ? (
            <PLChart
              PlValue={PlValue}
              plValuePercent={plValuePercent}
              data={plData}
              profit={PlProfit}
              dateKey={"year"}
            />
          ) : (
            chartLoading()
          )}
          <div className="flex items-center gap-[10px] xl:gap-[32px] ml-[30px] xl:ml-[55px] mt-[8px] flex-wrap">
            {timePeriod1.map((each, idx) => {
              return (
                <button
                  onClick={() => onSelectTp1(each)}
                  key={idx}
                  className={`w-[55px] h-[27px] text-[#A8A8A8] flex items-center justify-center text-[12px] text-roboto font-[400] hover:bg-[#2E2E2E] hover:bg-opacity-50 hover:rounded-[13.5px] ${
                    tpId1 === each.id && "bg-[#2E2E2E] rounded-[13.5px]"
                  }`}
                >
                  {each.tp}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-[#191919] w-[100%] rounded p-[24px]">
          <p className="text-roboto font-[500] text-[16px] text-[#F6F8FB] mb-[12px]">
            P&L Analysis
          </p>
          {!isChartLoading2 ? (
            <PLAnalysisBarChart data={plBarData} />
          ) : (
            chartLoading()
          )}
          <div className="flex items-center gap-[10px] xl:gap-[32px] ml-[10px] mt-[15px] flex-wrap">
            {timePeriod2.map((each, idx) => {
              return (
                <button
                  onClick={() => onSelectTp2(each)}
                  key={idx}
                  className={`w-[55px] h-[27px] text-[#A8A8A8] flex items-center justify-center text-[12px] text-roboto font-[400] hover:bg-[#2E2E2E] hover:bg-opacity-50 hover:rounded-[13.5px] ${
                    tpId2 === each.id && "bg-[#2E2E2E] rounded-[13.5px]"
                  }`}
                >
                  {each.tp}
                </button>
              );
            })}
          </div>
        </div>
        <Table
        tableData={transactionsData ? transactionsData : []}
        tableHeadings={tableHeadingsTransactions}
        profitLoss={true}
        />

        </div>
    </div>
  );
};

const Pl = () => {
  return <Sidebar layout={<PLPage />} />;
};
export default Pl;
