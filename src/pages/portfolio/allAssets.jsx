import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import GrossAssetValueChart from "../../components/portfolio/grossAssetValueChart";
import GrossAssetMoversChart from "../../components/portfolio/grossAssetMoversChart";
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

const AllAssetsPage = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isChartLoading, setChartLoading] = useState(false);
  const [isChartLoading2, setChartLoading2] = useState(false);
  const [isTableLoading, setTableLoading] = useState(false);
  const [tpId, setTpId] = useState(4);
  const [selectedOption, setSelectedOption] = useState(1);
  const [allAssetsData, setAllAssetsData] = useState([]);
  const [allAssetsChartDataGAV, setAllAssetsChartDataGAV] = useState([]);
  const [allAssetsChartDataNAV, setAllAssetsChartDataNAV] = useState([]);
  const [grossAssetProfit, setGrossAssetProfit] = useState(0);
  const [grossAssetProfitPercent, setGrossAssetProfitPercent] = useState(0);
  const [netAssetProfit, setNetAssetProfit] = useState(0);
  const [netAssetProfitPercent, setNetAssetProfitPercent] = useState(0);
  const [allAssetPriceDataGav, setAllAssetPriceDataGav] = useState([]);
  const [allAssetPriceDataNav, setAllAssetPriceDataNav] = useState([]);
  const [assetValue, setAssetValue] = useState(0);
  const [navAssetValue, setNavAssetValue] = useState(0);
  const [intervalText, setIntervalText] = useState("year");

  const dropdownRef = useRef(null);

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  useEffect(() => {
    getAllAssetsChartDataGAV();
    getAllAssetsChartDataNAV();
  }, [selectedCurrencyId, intervalText]);

  useEffect(() => {
    getAllAssetsData();
    getpriceData();
  }, [selectedCurrencyId]);

  const convertAllAssetsData = (data) => {
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
    ];

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
      setAssetValue(response?.data?.data?.totalCurrentValue || 0);
      setNavAssetValue(response?.data?.data?.total_net_value || 0);
      setGrossAssetProfit(response?.data?.data?.totalAssetGainOrLoss || 0);
      setGrossAssetProfitPercent(
        response?.data?.data?.totalAssetGainOrLossPercent || 0
      );
      setNetAssetProfit(response?.data?.data?.totalNetGainOrLoss || 0);
      setNetAssetProfitPercent(response?.data?.data?.totalNetGainOrLossPercent || 0);
      setTableLoading(false);
    } catch (error) {
      setAllAssetsData([]);
      setAssetValue(0);
      setNavAssetValue(0);
      setGrossAssetProfit(0);
      setGrossAssetProfitPercent(0);
      setNetAssetProfit(0);
      setNetAssetProfitPercent(0);
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
        year: item?.year,
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
        current_totalAsset_value: item?.cumulativeValue || 0, // Match GAV chart key
      }));
      setAllAssetsChartDataNAV(modifiedData);
    } else if (interval === "quarter") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " Q" + item?.quarter,
        current_totalAsset_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartDataNAV(modifiedData);
    } else if (interval === "week") {
      const modifiedData = data?.map((item) => ({
        year: moment(item?.start_date).format("DD/MM/YYYY"),
        current_totalAsset_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartDataNAV(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year,
        current_totalAsset_value: item?.cumulativeValue || 0,
      }));
      setAllAssetsChartDataNAV(modifiedData);
    }
    setChartLoading(false);
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
      console.log(response, "gav chart");
      convertAllAssetsChartDataGAV(response?.data?.data?.data, intervalText);
    } catch (error) {
      setAllAssetsChartDataGAV([]);
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
      console.log(response, "nav chart");
      convertAllAssetsChartDataNAV(response?.data?.data?.data, intervalText);
    } catch (error) {
      setAllAssetsChartDataNAV([]);
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
        stockPrice: data?.total_stock_net_value || 0,
        stockShare: data?.NAVStockPercent || 0,
        backgroundcolor: "#D6475D",
      },
      {
        id: 1,
        stockName: "Real Estate",
        stockPrice: data?.total_realEstate_net_value || 0,
        stockShare: data?.NAVRealEstatePercent || 0,
        backgroundcolor: "#6F50E5",
      },
      {
        id: 2,
        stockName: "Crypto",
        stockPrice: data?.total_crypto_net_value || 0,
        stockShare: data?.NetCryptoPercent || 0,
        backgroundcolor: "#486DF0",
      },
      {
        id: 3,
        stockName: "Bank Account",
        stockPrice: data?.total_bankAccount_net_value || 0,
        stockShare: data?.NAVBankAccountPercent || 0,
        backgroundcolor: "#85357D",
      },
      {
        id: 4,
        stockName: "Other Assets",
        stockPrice: data?.total_otherAsset_net_value || 0,
        stockShare: data?.NAVOtherAssetPercent || 0,
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
      <Header items={[{ label: "Portfolio > All Assets", link: "./" }]} />
      <div className="self-start ml-6 -mb-8 md:-mb-5 md:mt-3">
        <Breadcrumbs items={[{ label: "Portfolio > All Assets", link: "./" }]} />
      </div>
      <div className="w-full flex flex-col gap-[32px] mt-[32px] px-[5px] md:pl-[24px] md:pr-[28px] pb-[82px]">
        <div className="flex justify-between w-[100%] flex-wrap gap-8 xl:gap-0">
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
                  className={`transform ${!isDropdownOpen ? "rotate-0" : "rotate-180"}`}
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
                      className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto my-1 pl-2 hover:bg-[#3E3E3E] cursor-pointer ${selectedOption === each.id && "bg-[#3E3E3E]"
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
              <GrossAssetValueChart
                assetValue={navAssetValue}
                grossAssetProfit={netAssetProfit}
                grossAssetProfitPercent={netAssetProfitPercent}
                data={allAssetsChartDataNAV}
                dateKey={"year"}
              />
            ) : (
              chartLoading()
            )}
            <div className="flex items-center gap-[10px] xl:gap-[32px] ml-[55px] xl:ml-[55px] mt-[8px] flex-wrap">
              {timePeriod.map((each, idx) => (
                <button
                  onClick={() => onSelectTp(each)}
                  key={idx}
                  className={`w-[55px] h-[27px] text-[#A8A8A8] text-[12px] text-roboto font-[400] flex items-center justify-center hover:bg-[#2E2E2E] hover:bg-opacity-50 hover:rounded-[13.5px] ${tpId === each.id && "bg-[#2E2E2E] rounded-[13.5px]"
                    }`}
                >
                  {each.tp}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full min-w-[265px] md:w-[22%]">
            {selectedOption === 1 ? (
              !isChartLoading2 ? (
                console.log(allAssetPriceDataGav, "gav price data"),
                <StockPriceChart1 stockPriceData={allAssetPriceDataGav} />
              ) : (
                <LoadingStockPriceChart />
              )
            ) : !isChartLoading2 ? (
              console.log(allAssetPriceDataNav, "nav price data"),
              <StockPriceChart2 stockPriceData={allAssetPriceDataNav} />
            ) : (
              <LoadingStockPriceChart />
            )}
          </div>
        </div>
        <div>
          {!isTableLoading ? (
            <AllAssetsTable
              tableProps={{
                title: "All Assets",
                totalValue: `${selectedCurencySymbol}${FormatNumberWithCommas(assetValue)}`,
                valueChange: `${selectedCurencySymbol}${FormatNumberWithCommas(grossAssetProfit)}`,
                percentageChange: `${grossAssetProfitPercent?.toFixed(2) || 0}%`,
              }}
              tableHeadings={["Assets", "Book value", "Market value", "Gain & Loss"]}
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
              tableProps={{
                title: "All Assets",
                totalValue: `${selectedCurencySymbol}${FormatNumberWithCommas(assetValue)}`,
                valueChange: `${selectedCurencySymbol}${FormatNumberWithCommas(grossAssetProfit)}`,
                percentageChange: `${grossAssetProfitPercent?.toFixed(2) || 0}%`,
              }}
              tableHeadings={["Assets", "Book value", "Market value", "Gain & Loss"]}
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