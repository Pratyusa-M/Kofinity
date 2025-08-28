/* eslint-disable no-unused-vars */
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import GrossAssetValueChart from "../../components/portfolio/grossAssetValueChart";
import GrossAssetMoversChart from "../../components/portfolio/grossAssetMoversChart";
// import Stockpricegraph from "./stockpricegraph";
import StockPriceChart1 from "../../components/portfolio/stockPriceChart1";
import StockPriceChart2 from "../../components/portfolio/stockPriceChart2";
import Table from "../../components/common/Table";
import CommonNetAssetvalueChart from "../../components/common/commonNetAssetValueChart";
import caretdown from "../../assets/CaretDown.svg";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import AllAssetsTable from "../../components/common/allAssetsTable";
import { TailSpin } from "react-loader-spinner";
import { IoMdPricetag } from "react-icons/io";
import NoDataFoundTable from "../../components/common/noDataFoundTable";
import { FormatNumberWithCommas } from "../../components/common/commaSeparatedNumbers";
import LoadingStockPriceChart from "../../components/common/loadingPriceChart";
import moment from "moment/moment";
import Breadcrumbs from "../../components/common/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from "../../redux/store/slice/currencySlice";

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

const data2 = [
  {
    name: "01/08/2016",
    uv: 0,
    pv: 24,
    amt: 24,
  },
  {
    name: "02/08/2016",
    uv: 2,
    pv: 13,
    amt: 22,
  },
  {
    name: "03/08/2016",
    uv: 4,
    pv: 98,
    amt: 22,
  },
  {
    name: "04/08/2016",
    uv: 1,
    pv: 39,
    amt: 20,
  },
  { name: "05/08/2016", uv: 8, pv: 48, amt: 21 },
  {
    name: "06/08/2016",
    uv: 3,
    pv: 38,
    amt: 25,
  },
  {
    name: "07/08/2016",
    uv: 5,
    pv: 43,
    amt: 21,
  },
  {
    name: "08/08/2016",
    uv: 1,
    pv: 43,
    amt: 21,
  },
];

const items = [{ label: "Portfolio > All Assets", link: "./" }];
const tableProps = {
  title: "All Assets",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tableHeadings = ["Assets", "Book value", "Market value", "Gain & Loss",];

const tableData = [
  ["Stocks", "$5000", "$4500"],
  ["Real Estate", "$5000", "$4500"],
  ["Crypto", "$5000", "$4500"],
  ["Banks", "$5000", "$4500"],
  ["Other Assets", "$5000", "$4500"],
];

const stockPriceData = [
  {
    id: 0,
    stockName: "Stocks",
    stockPrice: "$200k",
    stockShare: "40%",
    backgroundcolor: "#D6475D",
  },
  {
    id: 1,
    stockName: "Real Estate",
    stockPrice: "$100k",
    stockShare: "15%",
    backgroundcolor: "#6F50E5",
  },
  {
    id: 2,
    stockName: "Crypto",
    stockPrice: "$100k",
    stockShare: "15%",
    backgroundcolor: "#486DF0",
  },
  {
    id: 3,
    stockName: "Bank Account",
    stockPrice: "$100k",
    stockShare: "15%",
    backgroundcolor: "#85357D",
  },
  {
    id: 4,
    stockName: "Other Assets",
    stockPrice: "$100k",
    stockShare: "15%",
    backgroundcolor: "#9B51E0",
  },
];

const AllAssetsPage = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isChartLoading, setChartLoading] = useState(false);
  const [isChartLoading2, setChartLoading2] = useState(false);
  const [isTableLoading, setTableLoading] = useState(false);
  const [tpId, setTpId] = useState(4);
  const [selectedOption, setSelectedOption] = useState(1);
  const [allAssetsData, setAllAssetsData] = useState([]);
  console.log("allassetsdata", allAssetsData);
  const [allAssetsChartDataGAV, setAllAssetsChartDataGAV] = useState([]);
  const [allAssetsChartDataNAV, setAllAssetsChartDataNAV] = useState([]);
  const [grossAssetProfit, setGrossAssetProfit] = useState();
  const [grossAssetProfitPercent, setGrossAssetProfitPercent] = useState();
  const [netAssetProfit, setNetAssetProfit] = useState();
  const [netAssetProfitPercent, setNetAssetProfitPercent] = useState();

  const [allAssetPriceDataGav, setAllAssetPriceDataGav] = useState([]);
  const [allAssetPriceDataNav, setAllAssetPriceDataNav] = useState([]);
  const [assetValue, setAssetValue] = useState();
  const [navAssetValue, setNavAssetValue] = useState();
  const [intervalText, setIntervalText] = useState("year");

  const dropdownRef = useRef(null);

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  useEffect(() => {
    // getAllAssetsData();
    getAllAssetsChartDataGAV();
    getAllAssetsChartDataNAV();
    // getpriceData();
  }, [selectedCurrencyId, intervalText]);

  useEffect(() => {
    getAllAssetsData();
    getpriceData();
  }, [selectedCurrencyId]);

  const convertAllAssetsData = (data) => {
    console.log(data, "all assets data");
    const tableDataAllStocks = [
      `Stocks`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        data?.totalPurchaseValueStocks || 0
      )}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        data?.totalCurrentValueStocks || 0
      )}`,
      `${FormatNumberWithCommas(data?.totalGainOrLossStocks || 0)}`,
      `${(data?.totalGainOrLossStocksPercent ?? 0)?.toFixed(2) || 0}%`,
    ];

    const tableDataAllCrypto = [
      `Crypto`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(data?.totalPurchaseValueCrypto || 0)}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(data?.totalCurrentValueCrypto || 0)}`,
      `${FormatNumberWithCommas(data?.totalGainOrLossCrypto || 0)}`,
      `${(data?.totalGainOrLossCryptoPercent ?? 0).toFixed(2) || 0}%`,
    ];
    console.log(data?.totalGainOrLossCryptoPercent, "crypto percent", FormatNumberWithCommas(data?.totalGainOrLossCryptoPercent));
    console.log(data?.totalGainOrLossCrypto, "crypto gain or loss");
    const tableDataAllrealEstate = [
      `Real Estate`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        data?.totalPurchaseValueRealEstate || 0
      )}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        data?.totalCurrentValueRealEstate || 0
      )}`,
      `${FormatNumberWithCommas(data?.totalGainOrLossRealEstate || 0)}`,
      `${(data?.totalGainOrLossRealEstatePercent ?? 0)?.toFixed(2) || 0}%`,
    ];

    const tableDataAllOtherAssets = [
      `Other Assets`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        data?.totalPurchaseValueOtherAssets || 0
      )}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        data?.totalCurrentValueOtherAssets || 0
      )}`,
      `${FormatNumberWithCommas(data?.totalGainOrLossOtherAssets || 0)}`,
      `${(data?.totalGainOrLossOtherAssetsPercent ?? 0)?.toFixed(2) || 0}%`,
    ];

    const tableDataAllBankAccount = [
      `Bank account`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        data?.totalAccountCurrentValue || 0
      )}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        data?.totalAccountCurrentValue || 0
      )}`,
      `${FormatNumberWithCommas(0)}`,
      `${0}%`,
      // `${FormatNumberWithCommas(data?.totalGainOrLossBalance || 0)}`,
      // `${data?.totalGainOrLossBalancePercent?.toFixed(2) || 0}%`,
    ];
    console.log([
      tableDataAllStocks,
      tableDataAllCrypto,
      tableDataAllrealEstate,
      tableDataAllOtherAssets,
      tableDataAllBankAccount,
    ], "all assets table data");

    setAllAssetsData([
      tableDataAllStocks,
      tableDataAllCrypto,
      tableDataAllrealEstate,
      tableDataAllOtherAssets,
      tableDataAllBankAccount,
    ]);
  };

  const getpriceData = async () => {
    setChartLoading2(true);
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

      getGAVStockPriceChartData(response?.data?.data);
      getNAVStockPriceChartData(response?.data?.data);
    } catch (error) {
      setAllAssetPriceDataGav([]);
      setAllAssetPriceDataNav([]);
      console.log(error.message);
      setChartLoading2(false);
    }
  };

  const getAllAssetsData = async () => {
    setTableLoading(true);
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

      convertAllAssetsData(response?.data?.data);
      setAssetValue(response?.data?.data?.totalCurrentValue);
      setNavAssetValue(response?.data?.data?.total_net_value);
      setGrossAssetProfit(response?.data?.data?.totalAssetGainOrLoss);
      setGrossAssetProfitPercent(response?.data?.data?.totalAssetGainOrLossPercent);
      setNetAssetProfit(response?.data?.data?.totalNetGainOrLoss)
      setNetAssetProfitPercent(response?.data?.data?.totalNetGainOrLossPercent)
      setTableLoading(false);
    } catch (error) {
      setAllAssetsData([]);
      setAssetValue(0);
      setNavAssetValue(0);

      setGrossAssetProfit(0);
      setGrossAssetProfitPercent(0);
      setNetAssetProfit(0)
      setNetAssetProfitPercent(0)
      console.log(error.message);
      setTableLoading(false);
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

  const convertAllAssetsChartDataGAV = (data, interval) => {
    if (interval === "month") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.monthName?.slice(0, 3),
        current_totalAsset_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartDataGAV(modifiedData);
    } else if (interval === "quarter") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " Q" + item?.quarter,
        current_totalAsset_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartDataGAV(modifiedData);
    } else if (interval === "week") {
      const modifiedData = data?.map((item) => ({
        year: moment(item?.start_date).format("DD/MM/YYYY"),
        current_totalAsset_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartDataGAV(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year || item?.start_date || item?.quarter,
        current_totalAsset_value: item?.cumulativeValue || 0,
      }));

      setAllAssetsChartDataGAV(modifiedData);
    }
    setChartLoading(false);
  };

  const convertAllAssetsChartDataNAV = (data, interval) => {
    if (interval === "month") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.monthName?.slice(0, 3),
        total_net_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartDataNAV(modifiedData);
    } else if (interval === "quarter") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " Q" + item?.quarter,
        total_net_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartDataNAV(modifiedData);
    } else if (interval === "week") {
      const modifiedData = data?.map((item) => ({
        year: moment(item?.start_date).format("DD/MM/YYYY"),
        total_net_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartDataNAV(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year || item?.start_date || item?.quarter,
        total_net_value: item?.cumulativeValue || 0,
      }));

      setAllAssetsChartDataNAV(modifiedData);
    }
  };

  const getAllAssetsChartDataGAV = async () => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}user-assets/total/history?interval=${intervalText}&type=null&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      convertAllAssetsChartDataGAV(response?.data?.data?.data, intervalText);
      // setGrossAssetProfit(response?.data?.data?.profitLoss?.profitLossValue);
      // setGrossAssetProfitPercent(
      //   response?.data?.data?.profitLoss?.profitLossPercentage
      // );
      setChartLoading(false);
    } catch (error) {
      setAllAssetsChartDataGAV([]);
      // setGrossAssetProfit(0);
      // setGrossAssetProfitPercent(0);
      setChartLoading(false);
      console.log(error.message);
    }
  };

  const getAllAssetsChartDataNAV = async () => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}user-assets/total/history?interval=${intervalText}&type=NAV&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      convertAllAssetsChartDataNAV(response?.data?.data?.data, intervalText);
      // setNetAssetProfit(response?.data?.data?.profitLoss?.profitLossValue);
      // setNetAssetProfitPercent(
      //   response?.data?.data?.profitLoss?.profitLossPercentage
      // );
      setChartLoading(false);
    } catch (error) {
      setAllAssetsChartDataNAV([]);
      // setNetAssetProfit(0);
      // setNetAssetProfitPercent(0);
      setChartLoading(false);
      console.log(error.message);
    }
  };

  const getGAVStockPriceChartData = (data) => {
    const priceDataGAV = [
      {
        id: 0,
        stockName: "Stocks",
        stockPrice: data?.totalCurrentValueStocks || 0,
        stockShare: data?.GAVStockPercent || 0,
        backgroundcolor: "#D6475D",
      },
      {
        id: 1,
        stockName: "Real Estate",
        stockPrice: data?.totalCurrentValueRealEstate || 0,
        stockShare: data?.GAVRealEstatePercent || 0,
        backgroundcolor: "#6F50E5",
      },
      {
        id: 2,
        stockName: "Crypto",
        stockPrice: data?.totalCurrentValueCrypto || 0,
        stockShare: data?.GAVCryptoPercent || 0,
        backgroundcolor: "#486DF0",
      },
      {
        id: 3,
        stockName: "Bank Account",
        stockPrice: data?.totalAccountCurrentValue || 0,
        stockShare: data?.GAVBankAccountPercent || 0,
        backgroundcolor: "#85357D",
      },
      {
        id: 4,
        stockName: "Other Assets",
        stockPrice: data?.totalCurrentValueOtherAssets || 0,
        stockShare: data?.GAVOtherAssetPercent || 0,
        backgroundcolor: "#9B51E0",
      },
    ];
    setAllAssetPriceDataGav(priceDataGAV);
    setChartLoading2(false);
  };

  const getNAVStockPriceChartData = (data) => {
    const priceDataNAV = [
      {
        id: 0,
        stockName: "Stocks",
        stockPrice: data?.total_stock_net_value,
        stockShare: data?.NAVStockPercent,
        backgroundcolor: "#D6475D",
      },
      {
        id: 1,
        stockName: "Real Estate",
        stockPrice: data?.total_realEstate_net_value,
        stockShare: data?.NAVRealEstatePercent,
        backgroundcolor: "#6F50E5",
      },
      {
        id: 2,
        stockName: "Crypto",
        stockPrice: data?.total_crypto_net_value,
        stockShare: data?.NetCryptoPercent,
        backgroundcolor: "#486DF0",
      },
      {
        id: 3,
        stockName: "Bank Account",
        stockPrice: data?.total_bankAccount_net_value,
        stockShare: data?.NAVBankAccountPercent,
        backgroundcolor: "#85357D",
      },
      {
        id: 4,
        stockName: "Other Assets",
        stockPrice: data?.total_otherAsset_net_value,
        stockShare: data?.NAVOtherAssetPercent,
        backgroundcolor: "#9B51E0",
      },
    ];
    setAllAssetPriceDataNav(priceDataNAV);
    setChartLoading2(false);
  };

  const onSelectTp = (each) => {
    if (each?.id !== tpId) {
      setTpId(each.id);
      setIntervalText(each.interval);
      // getAllAssetsChartDataGAV(each.interval);
      // getAllAssetsChartDataNAV(each.interval);
    }
  };

  const openDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const onClickvalue = (id) => {
    setSelectedOption(id);
    setDropdownOpen(false);
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
                className="w-[190px] text-roboto font-[500] mx-2 text-[16px] text-[#F6F8FB] mb-[12px] flex items-center gap-2 relative"
              >
                {selectedOption === 1
                  ? "Gross Asset Value(GAV)"
                  : "Net Asset Value(NAV)"}
                <img
                  className={` transform ${!isDropdownOpen ? "rotate-0" : "rotate-180"
                    }`}
                  src={caretdown}
                  alt="down"
                />
              </div>
              {isDropdownOpen && (
                <div
                  // ref={dropdownRef}
                  className="w-[220px] absolute top-[60px] rounded pt-0 bg-[#2E2E2E] sm:w-[297px] h-auto  flex flex-col z-10 overflow-y-auto"
                >
                  {assetsData?.map((each, idx) => (
                    <p
                      key={idx}
                      onClick={() => onClickvalue(each.id, each.opt)}
                      className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto my-1 pl-2  hover:bg-[#3E3E3E] cursor-pointer ${selectedOption === each.id && "bg-[#3E3E3E]"
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
                <GrossAssetValueChart
                  assetValue={assetValue}
                  grossAssetProfit={grossAssetProfit}
                  grossAssetProfitPercent={grossAssetProfitPercent}
                  data={allAssetsChartDataGAV}
                  dateKey={"year"}
                />
              ) : (
                chartLoading()
              )
            ) : !isChartLoading ? (
              // Use GrossAssetValueChart for NAV as well to match the gradual style, adjusting props for NAV data
              <GrossAssetValueChart
                assetValue={navAssetValue}
                grossAssetProfit={netAssetProfit}
                grossAssetProfitPercent={netAssetProfitPercent}
                data={allAssetsChartDataNAV.map(item => ({ // Remap data to match expected key in GrossAssetValueChart
                  year: item.year,
                  current_totalAsset_value: item.total_net_value,
                }))}
                dateKey={"year"}
              />
            ) : (
              chartLoading()
            )}
            <div className="flex items-center gap-[10px] xl:gap-[32px] ml-[55px] xl:ml-[55px] mt-[8px] flex-wrap">
              {timePeriod.map((each, idx) => {
                return (
                  <button
                    onClick={() => onSelectTp(each)}
                    key={idx}
                    className={`w-[55px] h-[27px] text-[#A8A8A8] text-[12px] text-roboto font-[400] flex items-center justify-center hover:bg-[#2E2E2E] hover:bg-opacity-50 hover:rounded-[13.5px] ${tpId === each.id && "bg-[#2E2E2E] rounded-[13.5px]"
                      }`}
                  >
                    {each.tp}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="w-full min-w-[265px] md:w-[22%]">
            {selectedOption === 1 ? (
              !isChartLoading2 ? (
                <StockPriceChart1 stockPriceData={allAssetPriceDataGav} />
              ) : (
                <LoadingStockPriceChart />
              )
            ) : !isChartLoading2 ? (
              <StockPriceChart2 stockPriceData={allAssetPriceDataNav} />
            ) : (
              <LoadingStockPriceChart />
            )}
          </div>
        </div>
        <div>
          {!isTableLoading ? (
            <AllAssetsTable
              tableProps={tableProps}
              tableHeadings={tableHeadings}
              tableData={allAssetsData}
              profit={grossAssetProfit}
              profitPercent={grossAssetProfitPercent}
              assetValue={assetValue}
            />
          ) : (
            <NoDataFoundTable
              profit={grossAssetProfit}
              profitPercent={grossAssetProfitPercent}
              assetValue={assetValue}
              tableProps={tableProps}
              tableHeadings={tableHeadings}
              tableData={allAssetsData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const AllAssets = () => {
  return <Sidebar layout={<AllAssetsPage />} />;
};
export default AllAssets;