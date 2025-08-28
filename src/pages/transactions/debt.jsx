/* eslint-disable no-unused-vars */
import Header from "../../components/common/Header";
import Sidebar from "../../components/layout/Sidebar";

import DebtAssetChart from "../../components/transactions/debtAssetChart";
import Table from "../../components/common/Table";
import AllAssetsTable from "../../components/common/allAssetsTable";
import TransactionsAllAssetsTable from "../../components/common/transactionAllAssetsTable";
import { baseUrl } from "../../utils/baseUrl";
import axios from "axios";
import { useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import NoDataFoundTable from "../../components/common/noDataFoundTable";
import { FormatNumberWithCommas } from "../../components/common/commaSeparatedNumbers";
import moment from "moment/moment";
import Breadcrumbs from "../../components/common/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedMainCurrencyId,
  SelectedCurrencySymbol,
} from "../../redux/store/slice/currencySlice";

const items = [{ label: "Financials > Debt", link: "./" }];

const tableProps = {
  title: "Loans",
  totalValue: "$96000",
  valueChange: "+$6000",
  percentageChange: "+40%",
};

const tableHeadings = [
  "Loan name",
  "Interest(%)",
  "Maturity time (Months)",
  "Annual payment",
  "Assets",
  "Installation amount",
  "Actions",
];
const tableData = [
  ["Plot 1", "$5000", "$4500", "$1000", "plot 1"],
  ["Plot 1", "$5000", "$4500", "$1000", "plot 1"],
  ["Plot 1", "$5000", "$4500", "$1000", "plot 1"],
  ["Plot 1", "$5000", "$4500", "$1000", "plot 1"],
  ["Plot 1", "$5000", "$4500", "$1000", "plot 1"],
];

const DebtPage = () => {
  const [allAssetsData, setAllAssetsData] = useState([]);
  const [tpId, setTpId] = useState(4);
  const [isChartLoading, setChartLoading] = useState(false);
  const [isTableLoading, setTableLoading] = useState(false);
  const [debtAsseData, setDebtAssetData] = useState([]);
  const [totalLoanAmount, setTotalLoanAmount] = useState();
  const [intervalText, setIntervalText] = useState("year");

  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);
  const selectedCurrencyId = useSelector(selectedMainCurrencyId);

  useEffect(() => {
    // getAllAssetsData();
    getDebtAssetData("year");
  }, [selectedCurrencyId, intervalText]);

  useEffect(() => {
    getAllAssetsData();
  }, [selectedCurrencyId]);

  const convertDebtChartData = (data, interval) => {
    if (interval === "month") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.monthName?.slice(0, 3),
        total_net_value: item?.cumulativeValue || 0,
        total_loan_balance: item?.data?.remaining_balance || 0,
      }));
      setDebtAssetData(modifiedData);
    } else if (interval === "week") {
      const modifiedData = data?.map((item) => ({
        year: item?.start_date,
        total_net_value: item?.cumulativeValue || 0,
        total_loan_balance: item?.data?.remaining_balance || 0,
      }));
      setDebtAssetData(modifiedData);
    } else if (interval === "quarter") {
      const modifiedData = data?.map((item) => ({
        year: item?.year + " " + item?.quarterName,
        total_net_value: item?.cumulativeValue || 0,
        total_loan_balance: item?.data?.remaining_balance || 0,
      }));
      setDebtAssetData(modifiedData);
    } else {
      const modifiedData = data?.map((item) => ({
        year: item?.year,
        total_net_value: item?.cumulativeValue || 0,
        total_loan_balance: item?.totalBalance || 0,
      }));

      setDebtAssetData(modifiedData);
    }
  };

  const getDebtAssetData = async () => {
    setChartLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}loan/total-loan-balance/history?interval=${intervalText}&desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      convertDebtChartData(response?.data?.data, intervalText);
      setChartLoading(false);
    } catch (error) {
      setDebtAssetData([]);
      setChartLoading(false);
      console.log(error.message);
    }
  };

  const timePeriod = [
    { id: 1, tp: "Week", interval: "week" },
    { id: 2, tp: "Month", interval: "month" },
    { id: 3, tp: "Quarter", interval: "quarter" },
    { id: 4, tp: "Year", interval: "year" },
  ];

  const convertTransactionsAssetsData = (data) => {
    const transactionstableData = data.map((item) => [
      // item.id,
      `${item?.loan_type?.option || "No address"}`,
      `${item.interest_rate}%`,
      `${item.loan_term}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item.annual_payment)}`,
      `${item?.link_realEstate?.address_line1 || "No address"}`,
      `${selectedCurencySymbol}${FormatNumberWithCommas(item?.installment_amount)}`,
      `${item?.principal_amount ?? "No amount"}`,
      `${item?.bank_account?.id}`,
      `${item?.start_date}`,
      `${item?.payment_frequency?.option ??  "No frequency"}`,
      `${item?.id}`,

    ]);

    setAllAssetsData(transactionstableData);
  };

  const getAllAssetsData = async () => {
    setTableLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${baseUrl}loan?desiredCurrency=${selectedCurrencyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      convertTransactionsAssetsData(response?.data?.data?.data);
      setTotalLoanAmount(response?.data?.data?.total_loan_amount);
      setTableLoading(false);
    } catch (error) {
      setAllAssetsData([]);
      setTotalLoanAmount(0);
      setTableLoading(false);
      console.log(error.message);
    }
  };

  const onSelectTp = (each) => {
    if (each?.id !== tpId) {
      setTpId(each.id);
      setIntervalText(each.interval);
      // getDebtAssetData(each.interval);
    }
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
            Debt
          </p>
          {!isChartLoading ? (
            <DebtAssetChart data={debtAsseData} dateKey="year" />
          ) : (
            chartLoading()
          )}
          <div className="flex items-center gap-[10px] xl:gap-[32px] ml-[30px] xl:ml-[55px] mt-[8px] flex-wrap">
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
        {!isTableLoading ? (
          <TransactionsAllAssetsTable
            tableProps={tableProps}
            tableHeadings={tableHeadings}
            tableData={allAssetsData}
            loanAmount={totalLoanAmount}
            financialType="debt"
            onRefresh={getAllAssetsData}
          />
        ) : (
          <NoDataFoundTable
            tableProps={tableProps}
            tableHeadings={tableHeadings}
            tableData={allAssetsData}
          />
        )}
      </div>
    </div>
  );
};

const Debt = () => {
  return <Sidebar layout={<DebtPage />} />;
};
export default Debt;
