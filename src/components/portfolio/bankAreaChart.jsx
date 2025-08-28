/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import NoDataFoundChart from "../common/noDataFoundChart";
import downArrow from "../../assets/arrow2.svg";
import { FormatNumberWithCommas } from "../common/commaSeparatedNumbers";
import { useDispatch, useSelector } from "react-redux";
import { SelectedCurrencySymbol } from "../../redux/store/slice/currencySlice";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

import { FaArrowUp } from "react-icons/fa6";
// import caretdown from '../../assets/CaretDown.svg'

const data = [
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
    uv: 5,
    pv: 38,
    amt: 25,
  },
  {
    name: "07/08/2016",
    uv: 7,
    pv: 43,
    amt: 21,
  },
  {
    name: "08/08/2016",
    uv: 15,
    pv: 43,
    amt: 21,
  },
];

const BankAreaChart = ({
  data,
  dataKey,
  bankAccountProfit,
  bankAccountProfitPercent,
  assetValue,
}) => {
  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);

  const formatYAxisLabel = (value) => {
    if (value === 0) {
      return "0";
    }
    if (Math.abs(value) >= 1000000) {
      return `${value >= 0 ? "" : "-"}${Math.abs(value) / 1000000}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `${value >= 0 ? "" : "-"}${Math.abs(value) / 1000}k`;
    }
    return `${value >= 0 ? "" : "-"}${Math.abs(value)}`;
  };

  return (
    <div>
      {data?.length > 0 ? (
        <div className="bg-[#191919]  w-[100%] rounded">
          <div className="flex items-center gap-2 mb-[18px] flex-wrap">
            <p className="text-[24px] text-lato font-[400] text-[#FFFFFF]">
              {selectedCurencySymbol}
              {FormatNumberWithCommas(assetValue || 0) || 0}
            </p>
            <div className="flex items-center gap-2">
              <p
                className={`text-[16px] text-lato font-[400] ${
                  bankAccountProfitPercent >= 0
                    ? "text-[#1FB98B]"
                    : "text-[#B91F1F]"
                }`}
              >
                {selectedCurencySymbol}
                {FormatNumberWithCommas(bankAccountProfit || 0) || 0}
              </p>
              <p
                className={` h-[18px] text-[12px] text-lato font-[400]  bg-[#2E2E2E] flex items-center justify-center rounded-[2px] gap-1 ${
                  bankAccountProfitPercent >= 0
                    ? "text-[#1FB98B]"
                    : "text-[#B91F1F]"
                }`}
              >
                <span>{bankAccountProfitPercent?.toFixed(2) || 0}% </span>
                {bankAccountProfitPercent >= 0 ? (
                  <FaArrowUp />
                ) : (
                  <img src={downArrow} alt="d-arrow" />
                )}
              </p>
            </div>
          </div>
          <div className="">
            <div className="w-full ">
              <ResponsiveContainer width={"100%"} height={345}>
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 20,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="96.7897"
                      y1="55.7901"
                      x2="96.7897"
                      y2="108.07"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#9B51E0" />
                      <stop offset="1" stopColor="white" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    horizontal={false}
                    strokeDasharray="0 0"
                    stroke="#212121"
                  />
                  <XAxis
                    dataKey={dataKey}
                    tickLine={false}
                    stroke="#A8A8A8"
                    axisLine={{ stroke: "#2E2E2E" }}
                    tick={{
                      fontSize: 10,
                      fontFamily: "roboto",
                      fill: "#A8A8A8",
                      letterSpacing: "0.24px",
                      dy: 5,
                      dx: 0,
                      className: "custom-axis-label",
                    }}
                    // padding={{ left: 5 }}
                    // domain={['dataMin', 'dataMax']}
                  />
                  <YAxis
                    // ticks={[0, 5, 10, 15, 20, 25]}
                    tickLine={false}
                    interval={0}
                    stroke="#A8A8A8"
                    axisLine={{ stroke: "#2E2E2E" }}
                    tickFormatter={formatYAxisLabel}
                    domain={[1, "auto"]}
                    tick={{
                      fontSize: 12,
                      fontFamily: "roboto",
                      fill: "#A8A8A8",
                      letterSpacing: "0.24px",
                      // dy:-10
                      // className: "custom-axis-label",
                    }}
                    padding={{ bottom: 10 }}
                    //  width={10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2E2E2E",
                      border: "none",
                      borderRadius: "4px",
                      color: "#FFFFFF",
                      fontSize: "15px",
                      fontFamily: "Roboto",
                      fontWeight: 500,
                      // padding:'0px'
                    }}
                    cursor={{ fill: "transparent" }}
                    formatter={(value, name) => [
                      `${"GAV"}: ${value?.toFixed(2)}`,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="bankAccount_current_value"
                    stroke="#486DF0"
                    //   fill="url(#colorGradient)"
                    fill="#1E212F"
                    strokeWidth={2}
                    // dot={{ stroke: '#00FF00', fill: '#00FF00', r: 15 }}
                    // activeDot={{ r: 10 }}
                  />
                             <ReferenceLine
  y={0}
  stroke="#444"
/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <NoDataFoundChart
          assetValue={assetValue}
          // profit={bankAccountProfit}
          profit={0}
          // profitPercent={bankAccountProfitPercent}
          profitPercent={0}
        />
      )}
    </div>
  );
};

export default BankAreaChart;
