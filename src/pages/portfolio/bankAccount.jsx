/* eslint-disable no-unused-vars */

import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";
import BankAreaChart from "../../components/portfolio/bankAreaChart";
// import Stockpricegraph from "./stockpricegraph";
import StockPriceChart1 from "../../components/portfolio/stockPriceChart1";
import Table from "../../components/common/Table";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { TailSpin } from "react-loader-spinner";
import caretdown from "../../assets/CaretDown.svg";
import NoDataFoundChart from "../../components/common/noDataFoundChart";
import NoDataFoundTable from "../../components/common/noDataFoundTable";
import { FormatNumberWithCommas } from "../../components/common/commaSeparatedNumbers";
import BankAccountTable from "../../components/common/bankAccountTable";
import LoadingStockPriceChart from "../../components/common/loadingPriceChart";
import moment from "moment/moment";
import Breadcrumbs from "../../components/common/BreadCrumbs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from "../../redux/store/slice/currencySlice";

const items = [{ label: "Portfolio > Bank Account", link: "./" }];

const tablePropsBankAccount = {
  title: "Bank Account",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tableHeadingsBankAccount = [
  "Assets",
  "Account number",
  "Currency",
  "Cash",
  "Interest rate(%)",
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
    stockPrice: "$200k",
    stockShare: "40%",
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

const BankAccountPage = () => {
  const [banksData, setBanksData] = useState([]);
  const [isChartLoading, setChartLoading] = useState(false);
  const [isChartLoading2, setChartLoading2] = useState(false);
  const [isTableLoading, setTableLoading] = useState(false);
  const [allAssetsChartData, setAllAssetsChartData] = useState([]);
  const [tpId, setTpId] = useState(4);
  const [selectedOption, setSelectedOption] = useState(1);
  const [bankAccountProfit, setBankAccountProfit] = useState();
  const [bankAccountProfitPercent, setBankAccountProfitPercent] = useState();
  const [banksPriceData, setBanksPriceData] = useState([]);
  const [assetValue, setAssetValue] = useState();
  const [bankAccountsData, setBankAccountsData] = useState([]);
  const [selectedBankAccountId, setSelectedbankAccountId] = useState(null);
  const [isOpenBanksDropdown, setBanksDropdown] = useState(false);
  const [intervalText, setIntervalText] = useState("years");

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  useEffect(() => {
    // getBanksData();
    getAllAssetsChartData();
    // getAssetValues();
  }, [selectedCurrencyId, intervalText]);

  useEffect(() => {
    getBanksData();
    getAssetValues();
  }, [selectedCurrencyId]);

  const convertAllAssetsChartData = (data, interval) => {
    if (interval === "months") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.monthName?.slice(0, 3),
        bankAccount_current_value: item?.data?.amount || 0,
      }));
      setAllAssetsChartData(modifiedData);
    } else if (interval === "weeks") {
      const modifiedData = data?.map((item) => ({
        year: item?.start_date,
        bankAccount_current_value: item?.data?.amount || 0,
      }));
      setAllAssetsChartData(modifiedData);
    } else if (interval === "quarters") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " Q" + item?.quarter,
        bankAccount_current_value: item?.data?.amount || 0,
      }));
      setAllAssetsChartData(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year,
        bankAccount_current_value: item?.data?.amount || 0,
      }));

      setAllAssetsChartData(modifiedData);
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

      setAssetValue(response?.data?.data?.totalAccountCurrentValue);
    } catch (error) {
      setAssetValue(0);
      console.log(error.message);
    }
  };

  const timePeriod = [
    { id: 1, tp: "Week", interval: "weeks" },
    { id: 2, tp: "Month", interval: "months" },
    { id: 3, tp: "Quarter", interval: "quarters" },
    { id: 4, tp: "Year", interval: "years" },
  ];

  const getBankAccountDetails = (data) => {
    data?.forEach((item) => {
      const accountNumber = item.account_number.toString();
      let modifiedName = "";
      if (accountNumber.length >= 4) {
        const lastFourDigits = accountNumber.slice(-4);
        const hiddenDigits = "*".repeat(accountNumber.length - 4);
        modifiedName = `${item.bank_name.name}( ${hiddenDigits}${lastFourDigits} )`;
      } else {
        modifiedName = `${item.bank_name.name}( ${accountNumber} )`;
      }
      item.bank_name.name = modifiedName;
    });

    const banksData = [...data];
    setBankAccountsData(banksData);
    console.log(banksData, "user bank dataaa");
  };

  const getAllAssetsChartData = async () => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}bank-account/transaction/history?interval=${intervalText}&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      convertAllAssetsChartData(response?.data?.data, intervalText);

      setBankAccountProfit(response?.data?.profitLoss?.profitLossValue);
      setBankAccountProfitPercent(
        response?.data?.profitLoss?.profitLossPercentage
      );
      setChartLoading(false);
    } catch (error) {
      setAllAssetsChartData([]);
      setBankAccountProfit(0);
      setBankAccountProfitPercent(0);
      setChartLoading(false);
      console.log(error.message);
    }
  };

  const convertBanksData = (data) => {
    const bankData = data?.map((item) => [
      item?.id,
      item?.bank_name?.name || "N/A",
      item?.account_number,
      selectedCurrencyId === 21 ? "USD" : selectedCurrencyId === 22 ?  "EUR" : "N/A",
      `${selectedCurencySymbol}${FormatNumberWithCommas(
        item?.current_balance
      )}`,
      `${item?.annual_interest_rate || 0}%`,
      // `${FormatNumberWithCommas(item?.gain_loss_val)}`,
      // `${item?.gain_loss_percent?.toFixed(2)}%`,
      `${0}`,
      `${0}%`,
    ]);

    setBanksData(bankData);
  };

  const getBanksData = async () => {
    setTableLoading(true);
    setChartLoading2(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}bank-account?desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      convertBanksData(response?.data?.data);
      getBankAccountPriceData(response?.data?.data);
      getBankAccountDetails(response?.data?.data);
      setTableLoading(false);
      setChartLoading2(false);
    } catch (error) {
      setBanksData([]);
      setBanksPriceData([]);
      setBankAccountsData([]);
      console.log(error.message);
      setTableLoading(false);
      setChartLoading2(false);
    }
  };

  const getBankAccountPriceData = (data) => {
    console.log(data, "bank account data for price chart");

    const priceData = data?.map((item, index) => ({
      id: index,
      stockName: item?.bank_name?.name,
      stockPrice: item?.current_balance,
      stockShare: item?.percentage,
    }));

        
      setBanksPriceData(priceData);
   
  };

  const onSelectTp = (each) => {
    if (each?.id !== tpId) {
      setTpId(each.id);
      setIntervalText(each.interval);
      // getAllAssetsChartData(each.interval);
    }
  };

  const onClickBanksDropdown = () => {
    setBanksDropdown(!isOpenBanksDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // setDropdownOpen(false);
      setBanksDropdown(false);
      //  setProfileOpen(false)
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

  const onNavigateToTransactionHistory = (each, idx) => {
    if (location.pathname === "/bankaccount") {
      navigate("/banktransactionhistory", {
        state: {
          bankTransHistoryId: each?.id,
          bankTransRoute: "/bankaccount",
          bankName: each?.bank_name?.name,
        },
      });
    }
    setSelectedbankAccountId(idx);
    setBanksDropdown(false);
  };

  return (
    <div className="h-full w-full flex flex-col  items-center text-4xl text-roboto font-[600] text-white bg-black">
      <Header items={items} />
            <div className="self-start ml-6 -mb-5 mt-3">
        <Breadcrumbs items={items} />
      </div>
      <div className=" w-full flex flex-col gap-[32px] mt-[32px] px-[5px] md:pl-[24px] md:pr-[28px] pb-[82px]">
        <div className="flex justify-between w-[100%] flex-wrap gap-8 xl:gap-0 ">
          <div className="w-[100%] xl:w-[76%] bg-[#191919] rounded pt-0 md:pt-[10px] p-[10px] md:p-[24px] relative">
            <div className="flex items-center justify-between">
              <p className="text-roboto mx-2 font-[500] text-[16px] text-[#F6F8FB] mb-[12px]">
                Banks
              </p>
              <div
                ref={dropdownRef}
                className="relative bg-[#2E2E2E] rounded-[18px] w-[97px] h-[27px]"
              >
                <div
                  onClick={onClickBanksDropdown}
                  className="flex justify-center items-center gap-4 -mt-[6px] cursor-pointer"
                >
                  <span className=" text-[12px] font-[400] text-[#A8A8A8] text-roboto">
                    All Banks
                  </span>
                  <img
                    src={caretdown}
                    alt=""
                    className={`${
                      isOpenBanksDropdown ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
                {isOpenBanksDropdown && bankAccountsData?.length > 0 && (
                  <div
                    className="w-[240px] sm:w-[410px] bg-[#2E2E2E] h-[200px] absolute top-8 right-0 z-50 overflow-y-auto rounded"
                    // ref={dropdownRef}
                  >
                    {bankAccountsData?.map((each, idx) => (
                      <p
                        onClick={() =>
                          onNavigateToTransactionHistory(each, idx)
                        }
                        key={idx}
                        className={`text-[#F6F8FB] text-[16px] text-start font-[400] text-roboto pl-3 pb-1  hover:bg-[#3E3E3E] cursor-pointer ${
                          selectedBankAccountId === idx && "bg-[#3E3E3E]"
                        }`}
                      >
                        {each?.bank_name?.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {!isChartLoading ? (
              <BankAreaChart
                assetValue={assetValue}
                data={allAssetsChartData}
                bankAccountProfit={bankAccountProfit}
                bankAccountProfitPercent={bankAccountProfitPercent}
                dataKey={"year"}
              />
            ) : (
              chartLoading()
            )}
            <div className="flex items-center gap-[10px] xl:gap-[32px] ml-[20px] xl:ml-[55px] mt-[8px] flex-wrap">
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
              <StockPriceChart1 stockPriceData={banksPriceData} />
            ) : (
              <LoadingStockPriceChart />
            )}
          </div>
        </div>
        <div>
          {!isTableLoading ? (
            <BankAccountTable
              tableProps={tablePropsBankAccount}
              tableHeadings={tableHeadingsBankAccount}
              tableData={banksData ? banksData : []}
              profit={bankAccountProfit}
              profitPercent={bankAccountProfitPercent}
              assetValue={assetValue}
            />
          ) : (
            <NoDataFoundTable
              tableProps={tablePropsBankAccount}
              tableHeadings={tableHeadingsBankAccount}
              tableData={banksData ? banksData : []}
              profit={bankAccountProfit}
              profitPercent={bankAccountProfitPercent}
              assetValue={assetValue}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const BankAccount = () => {
  return <Sidebar layout={<BankAccountPage />} />;
};
export default BankAccount;
