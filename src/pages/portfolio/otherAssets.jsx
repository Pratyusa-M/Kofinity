/* eslint-disable no-unused-vars */
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import OtherAssetsChart from "../../components/portfolio/otherAssetsChart";
// import Stockpricegraph from "./stockpricegraph";
import StockPriceChart1 from "../../components/portfolio/stockPriceChart1";
import Table from "../../components/common/Table";
import { useState, useEffect, useRef } from "react";
import CommonNetAssetvalueChart from "../../components/common/commonNetAssetValueChart";
import caretdown from "../../assets/CaretDown.svg";
import { baseUrl } from "../../utils/baseUrl";
import axios from "axios";
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

const items = [{ label: "Portfolio > Other Assets", link: "./" }];

const tablePropsOtherAssets = {
  title: "Other Assets",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tableHeadingsOtherAssets = [
  "Assets",
  "Purchased value",
  "Current value",
  "Gain & Loss",
  "Actions",
];

const tableDataOtherAssets = [
  ["Gold watch", "$5000", "$4500"],
  ["Jewellery", "$5000", "$4500"],
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
    stockPrice: "$200k",
    stockShare: "40%",
    backgroundcolor: "#9B51E0",
  },
];

const OtherAssetsPage = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [tpId, setTpId] = useState(4);
  const [otherAssetsData, setOtherAssetsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(1);
  const [isChartLoading, setChartLoading] = useState(false);
  const [isChartLoading2, setChartLoading2] = useState(false);
  const [isTableLoading, setTableLoading] = useState(false);
  const [allAssetsChartData, setAllAssetsChartData] = useState([]);
  const [otherAssetProfit, setOtherAssetProfit] = useState();
  const [otherAssetProfitPercent, setOtherAssetProfitPercent] = useState();
  const [netOtherAssetProfit, setNetOtherAssetProfit] = useState();
  const [netOtherAssetProfitPercent, setNetOtherAssetProfitPercent] =
    useState();
  const [otherAssetPriceData, setOtherAssetPriceData] = useState([]);
  const [assetValue, setAssetValue] = useState();
  const [NavAssetValue, setNavAssetValue] = useState();
  const [intervalText, setIntervalText] = useState("year");

  const dropdownRef = useRef(null);

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  useEffect(() => {
    localStorage.removeItem("sellOtherAssetFormData");
  }, []);

  useEffect(() => {
    // getOtherAssets();
    getAllAssetsChartData();
    // getAssetValues();
  }, [selectedCurrencyId, intervalText]);

  useEffect(() => {
    getOtherAssets();
    getAssetValues();
  }, [selectedCurrencyId]);

  const convertAllAssetsChartData = (data, interval) => {
    if (interval === "month") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.monthName?.slice(0, 3),
        otherAsset_current_value: item?.cumulativeValue || 0,
        total_otherAsset_net_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartData(modifiedData);
    } else if (interval === "week") {
      const modifiedData = data?.map((item) => ({
        year: moment(item?.start_date).format("DD/MM/yyyy"),
        otherAsset_current_value: item?.cumulativeValue || 0,
        total_otherAsset_net_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartData(modifiedData);
    } else if (interval === "quarter") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " Q" + item?.quarter,
        otherAsset_current_value: item?.cumulativeValue || 0,
        total_otherAsset_net_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartData(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year,
        otherAsset_current_value: item?.cumulativeValue || 0,
        total_otherAsset_net_value: item?.cumulativeValue || 0,
      }));

      setAllAssetsChartData(modifiedData);
    }
  };

  const getAssetValues = async () => {
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

      setAssetValue(response?.data?.data?.totalCurrentValueOtherAssets);
      setNavAssetValue(response?.data?.data?.total_otherAsset_net_value);
      setOtherAssetProfit(response?.data?.data?.totalGainOrLossOtherAssets);
      setOtherAssetProfitPercent(response?.data?.data?.totalGainOrLossOtherAssetsPercent);
      setNetOtherAssetProfit(response?.data?.data?.totalGainOrLossOtherAssets);
      setNetOtherAssetProfitPercent(response?.data?.data?.totalGainOrLossOtherAssetsPercent);
    } catch (error) {
      setAssetValue(0);
      setNavAssetValue(0);
      setOtherAssetProfit(0);
      setOtherAssetProfitPercent(0);
      setNetOtherAssetProfit(0);
      setNetOtherAssetProfitPercent(0);
      console.log(error.message);
    }
  };

  const getAllAssetsChartData = async () => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}other-asset/cumulative/graph?interval=${intervalText}&desiredCurrency=${selectedCurrencyId}`,
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

  const convertOtherAssetsData = (data) => {
    const OtherAssetsData = data?.map((item) => [
      item?.id,
      item?.asset_name || "N/A",
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.purchase_price)}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.current_price)}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.gain_loss_val)}`,
      `${item?.gain_loss_percent?.toFixed(2)}%`,
    ]);

    setOtherAssetsData(OtherAssetsData);
  };

  const getOtherAssets = async () => {
    setTableLoading(true);
    setChartLoading2(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}other-asset?desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      convertOtherAssetsData(response?.data?.data);
      getOtherAssetPriceData(response?.data?.data);
      setTableLoading(false);
      setChartLoading2(false);
    } catch (error) {
      setOtherAssetsData([]);
      setOtherAssetPriceData([]);
      console.log(error.message);
      setTableLoading(false);
      setChartLoading2(false);
    }
  };

  const getOtherAssetPriceData = (data) => {
    const priceData = data?.map((item, index) => ({
      id: index,
      stockName: item?.asset_type.name,
      stockPrice: item?.current_price,
      stockShare: parseFloat(item?.percentage),
    }));
    setOtherAssetPriceData(priceData?.slice(0, 2));
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
      <div className="self-start ml-6 -mb-5 mt-3">
        <Breadcrumbs items={items} />
      </div>
      <div className="w-full flex flex-col gap-[32px] mt-[32px] px-[5px] md:pl-[24px] md:pr-[28px] pb-[82px]">
        <div className="flex justify-between w-[100%] flex-wrap gap-8 xl:gap-0">
          <div className="w-[100%] xl:w-[76%] bg-[#191919] rounded pt-0 md:pt-[10px] p-[10px] md:p-[24px] relative">
            <div ref={dropdownRef}>
              <div className="flex items-center justify-between">
                <div
                  onClick={openDropdown}
                  className="w-[110px] mx-2 text-roboto font-[500] text-[16px] text-[#F6F8FB] mb-[12px] flex items-center gap-2"
                >
                  Other Assets{" "}
                  <img
                    className={`transform ${
                      !isDropdownOpen ? "rotate-0" : "rotate-180"
                    }`}
                    src={caretdown}
                    alt="down"
                  />
                </div>
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
                <OtherAssetsChart
                  assetValue={assetValue}
                  otherAssetProfit={otherAssetProfit}
                  otherAssetProfitPercent={otherAssetProfitPercent}
                  data={allAssetsChartData}
                  dateKey={"year"}
                />
              ) : (
                chartLoading()
              )
            ) : !isChartLoading ? (
              <OtherAssetsChart
                assetValue={NavAssetValue}
                otherAssetProfit={netOtherAssetProfit}
                otherAssetProfitPercent={netOtherAssetProfitPercent}
                data={allAssetsChartData.map(item => ({
                  year: item.year,
                  otherAsset_current_value: item.total_otherAsset_net_value,
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
              <StockPriceChart1 stockPriceData={otherAssetPriceData} />
            ) : (
              <LoadingStockPriceChart />
            )}
          </div>
        </div>
        <div>
          {!isTableLoading ? (
            <Table
              tableProps={tablePropsOtherAssets}
              tableHeadings={tableHeadingsOtherAssets}
              tableData={otherAssetsData}
              profit={otherAssetProfit}
              profitPercent={otherAssetProfitPercent}
              assetValue={assetValue}
            />
          ) : (
            <NoDataFoundTable
              tableProps={tablePropsOtherAssets}
              tableHeadings={tableHeadingsOtherAssets}
              tableData={otherAssetsData}
              profit={otherAssetProfit}
              profitPercent={otherAssetProfitPercent}
              assetValue={assetValue}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const OtherAssets = () => {
  return <Sidebar layout={<OtherAssetsPage />} />;
};
export default OtherAssets;