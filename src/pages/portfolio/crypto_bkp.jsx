/* eslint-disable no-unused-vars */
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import CryptoAreaChart from "../../components/portfolio/cryptoAreaChart";
import GrossAssetMoversChart from "../../components/portfolio/grossAssetMoversChart";
// import Stockpricegraph from "./stockpricegraph";
import StockPriceChart1 from "../../components/portfolio/stockPriceChart1";
import MyMoversNegativeChart from "../../components/portfolio/myMoversNegativeChart";
import Table from "../../components/common/Table";
import CommonNetAssetvalueChart from "../../components/common/commonNetAssetValueChart";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { FormatNumberWithCommas } from "../../components/common/commaSeparatedNumbers";
import NoDataFoundTable from "../../components/common/noDataFoundTable";
import { TailSpin } from "react-loader-spinner";
import LoadingStockPriceChart from "../../components/common/loadingPriceChart";
import caretdown from "../../assets/CaretDown.svg";
import Breadcrumbs from "../../components/common/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from "../../redux/store/slice/currencySlice";
import moment from "moment/moment";

const items = [{ label: "Portfolio > Crypto", link: "./" }];

const data = [
  {
    name: "01/08/2016",
    uv: 0,
    pv: 24,
    amt: 24,
  },
  {
    name: "02/08/2016",
    uv: 0,
    pv: 13,
    amt: 22,
  },
  {
    name: "03/08/2016",
    uv: 0,
    pv: 98,
    amt: 22,
  },
  {
    name: "04/08/2016",
    uv: 0,
    pv: 39,
    amt: 20,
  },
  { name: "05/08/2016", uv: 0, pv: 48, amt: 21 },
  {
    name: "06/08/2016",
    uv: 10,
    pv: 38,
    amt: 25,
  },
  {
    name: "07/08/2016",
    uv: 10,
    pv: 43,
    amt: 21,
  },
  {
    name: "08/08/2016",
    uv: 10,
    pv: 43,
    amt: 21,
  },
];

const tablePropsCrypto = {
  title: "Crypto",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tableHeadingsCrypto = [
  "Assets",
  "Quantity",
  "Average unit cost",
  "Book value",
  "Market price",
  "Market value",
  "Gain & Loss",
  "Actions",
];

const tableDataCrypto = [
  [1, "Luna", "$5000", "$5000", "$4500", "$4500", "$4500", 100, "40%"],
  [2, "Lite coin", "$5000", "$5000", "$4500", "$4500", "$4500", 150, "25%"],
  [3, "Shibu uno", "$5000", "$5000", "$4500", "$4500", "$4500", 120, "23%"],
  [4, "XRS", "$5000", "$5000", "$4500", "$4500", "$4500", 110, "50%"],
  [5, "Bitcoin", "$5000", "$5000", "$4500", "$4500", "$4500", 130, "60%"],
];

const stockPriceData = [
  {
    id: 0,
    stockName: "Stocks",
    stockPrice: 100,
    stockShare: 15,
    backgroundcolor: "#D6475D",
  },
  {
    id: 1,
    stockName: "Real Estate",
    stockPrice: 100,
    stockShare: 15,
    backgroundcolor: "#6F50E5",
  },
  {
    id: 2,
    stockName: "Crypto",
    stockPrice: 200,
    stockShare: 40,
    backgroundcolor: "#486DF0",
  },
  {
    id: 3,
    stockName: "Bank Account",
    stockPrice: 100,
    stockShare: 15,
    backgroundcolor: "#85357D",
  },
  {
    id: 4,
    stockName: "Other Assets",
    stockPrice: 100,
    stockShare: 15,
    backgroundcolor: "#9B51E0",
  },
];

const CryptoPage = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [tpId, setTpId] = useState(4);
  const dropdownRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(1);
  const [allAssetsChartData, setAllAssetsChartData] = useState([]);
  const [isTableLoading, setTableLoading] = useState(false);
  const [isChartLoading, setChartLoading] = useState(false);
  const [isChartLoading2, setChartLoading2] = useState(false);
  const [assetValue, setAssetValue] = useState();
  console.log("assetValue", assetValue);
  const [navAssetValue, setNavAssetValue] = useState();
  const [stockProfit, setStockProfit] = useState();
  const [stockProfitPercent, setStockProfitPercent] = useState();
  const [netStockProfit, setNetStockProfit] = useState();
  const [netStockProfitPercent, setNetStockProfitPercent] = useState();
  const [stockPriceData, setStockPriceData] = useState([]);

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);
  const [intervalText, setIntervalText] = useState("year");

  useEffect(() => {
    getCryptoData();
    getAllAssetsChartData();
    getAssetValues();
  }, [selectedCurrencyId, intervalText]);

  const convertAllAssetsChartData = (data, interval) => {
console.log("data", data);
    console.log("interval", interval);
    if (interval === "month") {
          const modifiedData = data?.map((item) => ({
            year: item?.year + " " + item?.monthName?.slice(0, 3),
            crypto_current_value: item?.cumulativeValue || 0,
            total_crypto_net_value: item?.cumulativeValue || 0,
          }));
          setAllAssetsChartData(modifiedData);
        } else if (interval === "week") {
          const modifiedData = data?.map((item) => ({
            year: moment(item?.start_date).format("DD/MM/yyyy"),
            crypto_current_value: item?.cumulativeValue || 0,
            total_crypto_net_value: item?.cumulativeValue || 0,
          }));
          setAllAssetsChartData(modifiedData);
        } else if (interval === "quarter") {
          console.log("quarter data", data);
          const modifiedData = data?.map((item) => ({
            year: item?.year + " Q" + item?.quarter,
            crypto_current_value: item?.cumulativeValue || 0,
            total_crypto_net_value: item?.cumulativeValue || 0,
          }));
          setAllAssetsChartData(modifiedData);
        } else {
          const modifiedData = data?.map((item) => ({
            year: item?.year,
            crypto_current_value: item?.cumulativeValue || 0,
            total_crypto_net_value: item?.cumulativeValue || 0,
          }));
    
          setAllAssetsChartData(modifiedData);
        }
      };


    // if (interval === "month") {
    //   const modifiedData = data?.map((item) => ({
    //     year: item?.year + " " + item?.month?.slice(0, 3),
    //     crypto_current_value: item?.cumulativeValue || 0,
    //     total_crypto_net_value: item?.cumulativeValue || 0,
    //   }));
    //   setAllAssetsChartData(modifiedData);
    // } else {
    //   const modifiedData = data?.map((item) => ({
    //     year: item?.year || item?.start_date || item?.quarter,
    //     crypto_current_value: item?.cumulativeValue || 0,
    //     total_crypto_net_value: item?.cumulativeValue || 0,
    //   }));

    //   setAllAssetsChartData(modifiedData);
    // }
  

  const getAssetValues = async (interval) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}user-assets/total/asset?desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssetValue(response?.data?.data?.totalCurrentValueCrypto);
      setNavAssetValue(response?.data?.data?.total_crypto_net_value);
      setStockProfit(response?.data?.data?.totalGainOrLossCrypto);
      setStockProfitPercent(response?.data?.data?.totalGainOrLossCryptoPercent);
      setNetStockProfit(response?.data?.data?.totalGainOrLossCrypto);
      setNetStockProfitPercent(response?.data?.data?.totalGainOrLossCryptoPercent);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllAssetsChartData = async (interval) => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}crypto/cumulative/graph?interval=${intervalText}&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
console.log("response", response?.data?.data);
      convertAllAssetsChartData(response?.data?.data?.data, intervalText);
      // setStockProfit(response?.data?.data?.data?.cryptoProfit);
      // setStockProfitPercent(response?.data?.data?.totalGainOrLossCryptoPercent);
      // setNetStockProfit(response?.data?.data?.totalGainOrLossCrypto);
      // setNetStockProfitPercent(response?.data?.data?.cryptoNetProfitPercent);
      setChartLoading(false);
    } catch (error) {
      setChartLoading(false);
      console.log(error.message);
    }
  };

  const getStockPriceData = (data) => {
    console.log("dataww", data);
    const priceData = data?.map((item, index) => ({
      id: index,
      stockName: item?.ticker?.ticker,
      stockPrice: item?.market_value,
      stockShare: parseFloat(item?.volume_percentage),
    }));

    setStockPriceData(priceData?.slice(0, 5));
  };

  const convertCryptoData = (data) => {
    console.log("data", data);
    const tableDataCypto = data?.map((item) => [
      item?.ticker.id,
      `${item.ticker.name}`,
      `${item.available_quantity}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.avg_unit_price)}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        item?.total_purchase_value
      )}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        item?.ticker.market_price ? item.market_price : 0
      )}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        item?.market_value
      )}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.gain_loss_val)}`,
      `${(item?.gain_loss_percent ?? 0).toFixed(2)}%`
,
    ]);
    setCryptoData(tableDataCypto);
  };

  const getCryptoData = async () => {
    setTableLoading(true);
    setChartLoading2(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}crypto?desiredCurrency=${selectedCurrencyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      convertCryptoData(response?.data?.data);
      getStockPriceData(response?.data?.data);
      setTableLoading(false);
      setChartLoading2(false);
    } catch (error) {
      console.log(error.message);
      setTableLoading(false);
      setChartLoading2(false);
    }
  };

  const assetsData = [
    { id: 1, opt: "Gross Asset Value(GAV)" },
    { id: 2, opt: "Net Asset Value(NAV)" },
  ];

  const timePeriod = [
    { id: 1, tp: "Week", interval: "week" },
    { id: 2, tp: "Month", interval: "month" },
    { id: 3, tp: "Quarter", interval: "quarter" },
    { id: 4, tp: "Year", interval: "year" },
  ];

  const onSelectTp = (each) => {
    if (each?.id !== tpId) {
      setTpId(each.id);
      // getAllAssetsChartData(each.interval);
      setIntervalText(each.interval);
    }
  };

  const openDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const onClickvalue = (id) => {
    setSelectedOption(id);
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="flex justify-between w-[100%] flex-wrap gap-8 xl:gap-0 ">
          <div className="w-[100%] xl:w-[76%] bg-[#191919] rounded pt-0 md:pt-[10px] p-[10px] md:p-[24px] relative">
            <div ref={dropdownRef}>
              <div
                onClick={openDropdown}
                className="w-[70px] mx-2 text-roboto font-[500] text-[16px] text-[#F6F8FB] mb-[12px] flex items-center gap-2"
              >
                Crypto{" "}
                <img
                  className={` transform ${
                    !isDropdownOpen ? "rotate-0" : "rotate-180"
                  }`}
                  src={caretdown}
                  alt="down"
                />
              </div>
              {isDropdownOpen && (
                <div className="w-[220px] absolute top-[60px] rounded pt-0 bg-[#2E2E2E] sm:w-[297px] h-auto  flex flex-col z-10 overflow-y-auto">
                  {assetsData?.map((each, idx) => (
                    <p
                      key={idx}
                      onClick={() => onClickvalue(each.id, each.opt)}
                      className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto my-1 pl-2  hover:bg-[#3E3E3E] cursor-pointer ${
                        selectedOption === each.id && "bg-[#3E3E3E]"
                      }
                 `}
                    >
                      {each.opt}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {selectedOption === 1 ? (
              !isChartLoading ? (
                <>
                  {console.log("allAssetsChartData", allAssetsChartData)}
                  <CryptoAreaChart
                    assetValue={assetValue}
                    data={allAssetsChartData}
                    stockProfit={stockProfit}
                    stockProfitPercent={stockProfitPercent}
                    dateKey={"year"}
                  />
                </>
              ) : (
                chartLoading()
              )
            ) : !isChartLoading ? (
              <CommonNetAssetvalueChart
                strokeColor={"#486DF0"}
                fillColor={"#1D212E"}
                data={allAssetsChartData}
                dataKey={"total_crypto_net_value"}
                assetValue={navAssetValue}
                profit={netStockProfit}
                profitPercent={netStockProfitPercent}
                dateKey={"year"}
              />
            ) : (
              chartLoading()
            )}
            <div className="flex items-center gap-[10px] xl:gap-[32px] ml-[50px] xl:ml-[55px] mt-[8px] flex-wrap">
              {timePeriod.map((each, idx) => {
                return (
                  <button
                    onClick={() => onSelectTp(each)}
                    key={idx}
                    className={`w-[55px] h-[27px] text-[#A8A8A8] text-[12px] text-roboto font-[400] flex items-center justify-center hover:bg-[#2E2E2E] hover:bg-opacity-50 hover:rounded-[13.5px] ${
                      tpId === each.id && "bg-[#2E2E2E] rounded-[13.5px]"
                    }`}
                  >
                    {each.tp}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="w-full min-w-[265px] md:w-[22%]">
            {!isChartLoading2 ? (
              <StockPriceChart1 stockPriceData={stockPriceData} />
            ) : (
              <LoadingStockPriceChart />
            )}
          </div>
        </div>
        <div>
          {!isTableLoading ? (
            <Table
              tableProps={tablePropsCrypto}
              tableHeadings={tableHeadingsCrypto}
              tableData={cryptoData}
              profit={stockProfit}
              profitPercent={stockProfitPercent}
              assetValue={assetValue}
            />
          ) : (
            <NoDataFoundTable
              tableProps={tablePropsCrypto}
              tableHeadings={tableHeadingsCrypto}
              tableData={cryptoData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Crypto = () => {
  return <Sidebar layout={<CryptoPage />} />;
};
export default Crypto;
