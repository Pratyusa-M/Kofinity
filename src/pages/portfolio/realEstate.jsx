/* eslint-disable no-unused-vars */

import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import RealEstateChart from "../../components/portfolio/realEstateChart";
// import Stockpricegraph from "./stockpricegraph";
import StockPriceChart1 from "../../components/portfolio/stockPriceChart1";
import StockPriceChart2 from "../../components/portfolio/stockPriceChart2";
import Table from "../../components/common/Table";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import caretdown from "../../assets/CaretDown.svg";
import CommonNetAssetvalueChart from "../../components/common/commonNetAssetValueChart";
import { TailSpin } from "react-loader-spinner";
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

const items = [{ label: "Portfolio > Real Estate", link: "./" }];

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

const tablePropsRealEstate = {
  title: "Real Estate",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tableHeadingsRealEstate = [
  "Assets",
  "Purchased value",
  "Current value",
  "Gain & Loss",
  "Actions",
];

const stockPriceData = [
  {
    id: 0,
    stockName: "Stocks",
    stockPrice: "$100k",
    stockShare: "15%",
    backgroundcolor: "#D6475D",
  },
  {
    id: 1,
    stockName: "Real Estate",
    stockPrice: "$200k",
    stockShare: "40%",
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

const RealEstatePage = () => {
  const [realEstateData, setRealEstateData] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [tpId, setTpId] = useState(4);
  const [selectedOption, setSelectedOption] = useState(1);
  const [allAssetsChartData, setAllAssetsChartData] = useState([]);
  const [navAssetChartData, setNavAssetChartData] = useState([]);
  const [isChartLoading, setChartLoading] = useState(false);
  const [isChartLoading2, setChartLoading2] = useState(false);
  const [isTableLoading, setTableLoading] = useState(false);
  const [realEstateProfit, setRealEstateProfit] = useState();
  const [realEstateProfitPercent, setRealEstateProfitPercent] = useState();
  const [netRealEstateProfit, setNetRealEstateProfit] = useState();
  const [netRealEstateProfitPercent, setNetRealEstateProfitPercent] =
    useState();
  const [realEstatePriceData, setRealEstatePriceData] = useState([]);
  const [assetValue, setAssetValue] = useState();
  const [NavAssetValue, setNetAssetValue] = useState();
  const [intervalText, setIntervalText] = useState("year");

  const dropdownRef = useRef(null);

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  useEffect(() => {
    localStorage.removeItem("sellRealEstateFormData");
  }, []);

  useEffect(() => {
    // getRealEstateData();
    getAllAssetsChartData();
    getNAVChartData();
    // getAssetValues();
  }, [selectedCurrencyId, intervalText]);

  useEffect(() => {
    getRealEstateData();
    getAssetValues();
  }, [selectedCurrencyId]);

  const convertAllAssetsChartData = (data, interval) => {
    if (interval === "month") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.monthName?.slice(0, 3),
        realEstate_current_value: item?.cumulativeValue || 0,
        total_realEstate_net_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartData(modifiedData);
    } else if (interval === "week") {
      const modifiedData = data?.map((item) => ({
        year: moment(item?.start_date).format("DD/MM/yyyy"),
        realEstate_current_value: item?.cumulativeValue || 0,
        total_realEstate_net_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartData(modifiedData);
    } else if (interval === "quarter") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " Q" + item?.quarter,
        realEstate_current_value: item?.cumulativeValue || 0,
        total_realEstate_net_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartData(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year,
        realEstate_current_value: item?.cumulativeValue || 0,
        total_realEstate_net_value: item?.cumulativeValue || 0,
      }));

      setAllAssetsChartData(modifiedData);
    }
  };

  const convertNAVAssetsChartData = (data, interval) => {
    if (interval === "month") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.monthName?.slice(0, 3),
        realEstate_current_value: item?.cumulativeValue || 0,
        total_realEstate_net_value: item?.cumulativeValue || 0,
      }));
      setNavAssetChartData(modifiedData);
    } else if (interval === "week") {
      const modifiedData = data?.map((item) => ({
        year: moment(item?.start_date).format("DD/MM/yyyy"),
        realEstate_current_value: item?.cumulativeValue || 0,
        total_realEstate_net_value: item?.cumulativeValue || 0,
      }));
      setNavAssetChartData(modifiedData);
    } else if (interval === "quarter") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " Q" + item?.quarter,
        realEstate_current_value: item?.cumulativeValue || 0,
        total_realEstate_net_value: item?.cumulativeValue || 0,
      }));
      setNavAssetChartData(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year,
        realEstate_current_value: item?.cumulativeValue || 0,
        total_realEstate_net_value: item?.cumulativeValue || 0,
      }));

      setNavAssetChartData(modifiedData);
    }
  };

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

      setAssetValue(response?.data?.data?.totalCurrentValueRealEstate);
      setNetAssetValue(response?.data?.data?.total_realEstate_net_value);
      setRealEstateProfit(response?.data?.data?.totalGainOrLossRealEstate);
      setRealEstateProfitPercent(response?.data?.data?.totalGainOrLossRealEstatePercent);
      setNetRealEstateProfit(response?.data?.data?.totalGainOrLossRealEstate);
      setNetRealEstateProfitPercent(response?.data?.data?.totalGainOrLossRealEstatePercent);
    } catch (error) {
      setAssetValue(0);
      setNetAssetValue(0);
      setRealEstateProfit(0);
      setRealEstateProfitPercent(0);
      setNetRealEstateProfit(0);
      setNetRealEstateProfitPercent(0);
      console.log(error.message);
    }
  };

  const getAllAssetsChartData = async () => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}real-estate/cumulative/graph?interval=${intervalText}&desiredCurrency=${selectedCurrencyId}&type=null`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      convertAllAssetsChartData(response?.data?.data?.data, intervalText);
      setChartLoading(false);
    } catch (error) {
      setAllAssetsChartData([]);
      setChartLoading(false);
      console.log(error.message);
    }
  };

  const getNAVChartData = async () => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}real-estate/cumulative/graph?interval=${intervalText}&desiredCurrency=${selectedCurrencyId}&type=NAV`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      convertNAVAssetsChartData(response?.data?.data?.data, intervalText);
      setChartLoading(false);
    } catch (error) {
      setNavAssetChartData([]);
      setChartLoading(false);
      console.log(error.message);
    }
  };

  const getRealEstateData = async () => {
    setTableLoading(true);
    setChartLoading2(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}real-estate?desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      convertRealEstateData(response?.data?.data);
      getRealEstatePriceData(response?.data?.data);
      setTableLoading(false);
      setChartLoading2(false);
    } catch (error) {
      console.log(error.message);
      setRealEstateData([]);
      setRealEstatePriceData([]);
      setTableLoading(false);
      setChartLoading2(false);
    }
  };

  const getRealEstatePriceData = (data) => {
    const priceData = data?.map((item, index) => ({
      id: index,
      stockName: item?.address_line1,
      stockPrice: item?.estimate_current_value,
      stockShare: parseFloat(item?.percentage),
    }));
    setRealEstatePriceData(priceData?.slice(0, 3));
  };

  const convertRealEstateData = (data) => {
    const tableDataRealEstate = data?.map((item, index) => [
      item?.id,
      `${item?.description}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.purchase_price)}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        item?.estimate_current_value
      )}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.gain_loss_val)}`,
      `${item?.gain_loss_percent?.toFixed(2)}%`,
    ]);

    setRealEstateData(tableDataRealEstate);
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
    <div className="h-full w-full flex flex-col items-center text-4xl text-roboto font-[600] text-white bg-black">
      <Header items={items} />
      <div className="self-start ml-6 -mb-8 md:-mb-5 md:mt-3">
        <Breadcrumbs items={items} />
      </div>
      <div className="w-full flex flex-col gap-[32px] mt-[32px] px-[5px] md:pl-[24px] md:pr-[28px] pb-[82px]">
        <div className="flex justify-between w-[100%] flex-wrap gap-8 xl:gap-0">
          <div className="w-[100%] xl:w-[76%] bg-[#191919] rounded pt-0 md:pt-[10px] p-[10px] md:p-[24px] relative">
            <div ref={dropdownRef}>
              <div
                onClick={openDropdown}
                className="w-[100px] mx-2 text-roboto font-[500] text-[16px] text-[#F6F8FB] mb-[12px] flex items-center gap-2"
              >
                Real Estate{" "}
                <img
                  className={`transform ${
                    !isDropdownOpen ? "rotate-0" : "rotate-180"
                  }`}
                  src={caretdown}
                  alt="down"
                />
              </div>
              {isDropdownOpen && (
                <div className="w-[220px] absolute top-[60px] rounded pt-0 bg-[#2E2E2E] sm:w-[297px] h-auto flex flex-col z-10 overflow-y-auto">
                  {assetsData?.map((each, idx) => (
                    <p
                      key={idx}
                      onClick={() => onClickvalue(each.id, each.opt)}
                      className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto my-1 pl-2 hover:bg-[#3E3E3E] cursor-pointer ${
                        selectedOption === each.id && "bg-[#3E3E3E]"
                      }`}
                    >
                      {each.opt}
                    </p>
                  ))}
                </div>
              )}
            </div>
            {selectedOption === 1 ? (
              !isChartLoading ? (
                <RealEstateChart
                  assetValue={assetValue}
                  realEstateProfit={realEstateProfit}
                  realEstateProfitPercent={realEstateProfitPercent}
                  data={allAssetsChartData}
                  dateKey={"year"}
                />
              ) : (
                chartLoading()
              )
            ) : !isChartLoading ? (
              <RealEstateChart
                assetValue={NavAssetValue}
                realEstateProfit={netRealEstateProfit}
                realEstateProfitPercent={netRealEstateProfitPercent}
                data={navAssetChartData.map(item => ({
                  year: item.year,
                  realEstate_current_value: item.total_realEstate_net_value,
                }))}
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
              <StockPriceChart1 stockPriceData={realEstatePriceData} />
            ) : (
              <LoadingStockPriceChart />
            )}
          </div>
        </div>
        <div>
          {!isTableLoading ? (
            <Table
              tableProps={tablePropsRealEstate}
              tableHeadings={tableHeadingsRealEstate}
              tableData={realEstateData ? realEstateData : []}
              profit={realEstateProfit}
              profitPercent={realEstateProfitPercent}
              assetValue={assetValue}
            />
          ) : (
            <NoDataFoundTable
              tableProps={tablePropsRealEstate}
              tableHeadings={tableHeadingsRealEstate}
              tableData={realEstateData ? realEstateData : []}
              profit={realEstateProfit}
              profitPercent={realEstateProfitPercent}
              assetValue={assetValue}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const RealEstate = () => {
  return <Sidebar layout={<RealEstatePage />} />;
};
export default RealEstate;