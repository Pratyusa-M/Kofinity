/* eslint-disable no-unused-vars */
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import CashInFlowChart from "../../components/transactions/cashInFlowChart";
import CashFlowBarChart from "../../components/transactions/cashFlowBarChart";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { TailSpin } from "react-loader-spinner";
import Breadcrumbs from "../../components/common/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from "../../redux/store/slice/currencySlice";

const items = [{ label: "Financials > Cash flow", link: "./" }];

const CashFlowPage = () => {
  const [tpId1, setTpId1] = useState(4);
  const [tpId2, setTpId2] = useState(4);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChartLoading, setChartLoading] = useState(false);
  const [isChartLoading2, setChartLoading2] = useState(false);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [cashFlowBarData, setCashFlowBarData] = useState([]);
  console.log("cashFlowBarData", cashFlowBarData);
  const [cashFlowValue, setCashFlowvalue] = useState("");
  const [cashFlowValuePercent, setCashFlowvaluePercent] = useState("");
  const [assetvalue, setAssetValue] = useState("");
  const [intervalText1, setIntervalText1] = useState("year");
  const [intervalText2, setIntervalText2] = useState("year");

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  useEffect(() => {
    getCashFlowChartsData();
    // getCashFlowBarChartsData();
    // getCashFlowAssetValue()
  }, [selectedCurrencyId, intervalText1]);

  useEffect(() => {
    getCashFlowBarChartsData();
  }, [selectedCurrencyId, intervalText2]);

  const convertCahFlowChartData = (data, interval) => {
    if (interval === "month") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.monthName?.slice(0, 3),
        total_cashFlow: item?.data?.total_cashFlow || 0,
        stock_cashFlow: item?.data?.stock_cashFlow || 0,
        crypto_cashFlow: item?.data?.crypto_cashFlow || 0,
        realEstate_cashFlow: item?.data?.realEstate_cashFlow || 0,
        otherAsset_cashFlow: item?.data?.otherAsset_cashFlow || 0,
        bankAccount_cashFlow: item?.data?.bankAccount_cashFlow || 0,
      }));
      setCashFlowData(modifiedData);
    } else if (interval === "quarter") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.quarterName,
        total_cashFlow: item?.data?.total_cashFlow || 0,
        stock_cashFlow: item?.data?.stock_cashFlow || 0,
        crypto_cashFlow: item?.data?.crypto_cashFlow || 0,
        realEstate_cashFlow: item?.data?.realEstate_cashFlow || 0,
        otherAsset_cashFlow: item?.data?.otherAsset_cashFlow || 0,
        bankAccount_cashFlow: item?.data?.bankAccount_cashFlow || 0,
      }));
      setCashFlowData(modifiedData);
    } else if (interval === "week") {
      const modifiedData = data?.map((item) => ({
        year: item?.start_date,
        total_cashFlow: item?.data?.total_cashFlow || 0,
        stock_cashFlow: item?.data?.stock_cashFlow || 0,
        crypto_cashFlow: item?.data?.crypto_cashFlow || 0,
        realEstate_cashFlow: item?.data?.realEstate_cashFlow || 0,
        otherAsset_cashFlow: item?.data?.otherAsset_cashFlow || 0,
        bankAccount_cashFlow: item?.data?.bankAccount_cashFlow || 0,
      }));
      setCashFlowData(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year,
        total_cashFlow: item?.data?.total_cashFlow || 0,
        stock_cashFlow: item?.data?.stock_cashFlow || 0,
        crypto_cashFlow: item?.data?.crypto_cashFlow || 0,
        realEstate_cashFlow: item?.data?.realEstate_cashFlow || 0,
        otherAsset_cashFlow: item?.data?.otherAsset_cashFlow || 0,
        bankAccount_cashFlow: item?.data?.bankAccount_cashFlow || 0,
      }));

      setCashFlowData(modifiedData);
    }
  };

const convertResultData = (data) => {
  console.log(data, "result dataaa");

  const labelMap = {
    totalCashFlow:        "Total Cashflow",
    stockCashFlow:        "Stocks",
    realEstateCashFlow:   "Real Estate",
    cryptoCashFlow:       "Crypto",
    bankAccountCashFlow:  "Bank Account",
    otherAssetCashFlow:   "Other Assets",
  };

  const transformedData = Object.entries(data).map(([key, value]) => {
    const uv = value < 0 ? value : 0;
    const pv = value >= 0 ? value : 0;
    const label = labelMap[key] ?? key;

    console.log(key, value, uv, pv, label);
    return { uv, pv, label };
  });

  setCashFlowBarData(transformedData);
};

  const getCashFlowChartsData = async () => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}income/cashFlow/history?interval=${intervalText1}&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      convertCahFlowChartData(response?.data?.data?.data, intervalText1);
      setCashFlowvalue(response?.data?.data?.profitLoss?.totalProfitLoss);
      setCashFlowvaluePercent(
        response?.data?.data?.profitLoss?.totalProfitLossPercent
      );
      setAssetValue(response?.data?.data?.totalCashFlow);
      setChartLoading(false);
    } catch (error) {
      setCashFlowData([]);
      setCashFlowvalue(0);
      setCashFlowvaluePercent(0);
      setChartLoading(false);
      console.log(error.message);
    }
  };

  const getCashFlowBarChartsData = async () => {
    setChartLoading2(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}income/cashFlow/history?interval=${intervalText2}&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const allData = response?.data?.data;
      console.log(allData, "cash flow dataaa");
      const {
        totalCashFlow,
        stockCashFlow,
        realEstateCashFlow,
        otherAssetCashFlow,
        cryptoCashFlow,
        bankAccountCashFlow,
        ...resultData
      } = allData;
      convertResultData({
        totalCashFlow,
        stockCashFlow,
        realEstateCashFlow,
        cryptoCashFlow,
        bankAccountCashFlow,
        otherAssetCashFlow,
      });
      setChartLoading2(false);
    } catch (error) {
      setCashFlowBarData([]);
      setChartLoading2(false);
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

  const onSelectTp1 = (each) => {
    if (each?.id !== tpId1) {
      setTpId1(each.id);
      setIntervalText1(each.interval);
      // getCashFlowChartsData(each.interval);
    }
  };

  const onSelectTp2 = (each) => {
    if (each?.id !== tpId2) {
      setTpId2(each.id);
      setIntervalText2(each.interval);
      // getCashFlowBarChartsData(each.interval);
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
          <p className="text-roboto px-2 font-[500] text-[16px] text-[#F6F8FB] md:mb-[12px]">
            Cash Flow
          </p>
          {!isChartLoading ? (
            <CashInFlowChart
              assetvalue={assetvalue}
              cashFlowValue={cashFlowValue}
              cashFlowValuePercent={cashFlowValuePercent}
              data={cashFlowData}
              dateKey="year"
            />
          ) : (
            chartLoading()
          )}
          <div className="flex items-center gap-[10px] ml-[40px] xl:ml-[55px] mt-[8px] xl:gap-[32px] flex-wrap">
            {timePeriod1.map((each, idx) => {
              return (
                <button
                  onClick={() => onSelectTp1(each)}
                  key={idx}
                  className={`w-[55px] h-[27px] text-[#A8A8A8] text-[12px] text-roboto font-[400] hover:bg-[#2E2E2E] hover:bg-opacity-50 hover:rounded-[13.5px] flex items-center justify-center ${
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
            Cash flow Analysis
          </p>
          {!isChartLoading2 ? (
            <CashFlowBarChart data={cashFlowBarData} />
          ) : (
            chartLoading()
          )}
          <div className="flex items-center gap-[10px] ml-[10px] mt-[15px] xl:gap-[32px]  flex-wrap">
            {timePeriod2.map((each) => {
              return (
                <button
                  onClick={() => onSelectTp2(each)}
                  key={each.id}
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
      </div>
    </div>
  );
};

const CashFlow = () => {
  return <Sidebar layout={<CashFlowPage />} />;
};
export default CashFlow;
