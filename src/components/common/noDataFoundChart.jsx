/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import DownArrow from "../../assets/arrow2.svg";
import { FormatNumberWithCommas } from "./commaSeparatedNumbers";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  // Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { SelectedCurrencySymbol } from "../../redux/store/slice/currencySlice";

import { FaArrowUp } from "react-icons/fa6";

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

const NoDataFoundChart = ({
  profit,
  profitPercent,
  debtAssetCond,
  assetValue,
}) => {
  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);

  // const formatYAxisLabel = (value) => {
  //   // return value === 0 ? `${value}` : `${value}M`;
  //   if (value === 0) {
  //       return "0";
  //     }
  //     if (value >= 1000) {
  //       return `${value / 1000000}M`;
  //     }
  //     return value.toString()+'M';
  // };

  return (
    <div className="bg-[#191919] w-[100%] rounded relative">
      {!debtAssetCond ? (
        <div className="flex items-center gap-2 mb-[18px]">
          <p className="text-[24px] text-lato font-[400] text-[#FFFFFF]">
            {selectedCurencySymbol}
            {FormatNumberWithCommas(assetValue || 0) || 0}
          </p>
          <p
            className={`text-[16px] text-lato font-[400] ${
              profitPercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
            }`}
          >
            {selectedCurencySymbol}
            {Math.round(profit || 0)}
          </p>
          <p
            className={`w-[56px] h-[18px] text-[12px] text-lato font-[400] bg-[#2E2E2E] flex items-center justify-center rounded-[2px] gap-1 ${
              profitPercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
            }`}
          >
            <span>{Math.round(profitPercent || 0)}% </span>
            {profitPercent >= 0 ? (
              <FaArrowUp />
            ) : (
              <img src={DownArrow} alt="d-arrow" />
            )}
          </p>
        </div>
      ) : (
        <div className="h-[58px]"></div>
      )}
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
            dataKey=""
            tickLine={false}
            stroke="#A8A8A8"
            axisLine={{ stroke: "#2E2E2E" }}
            tick={{
              fontSize: 10,
              fontFamily: "roboto",
              fill: "#A8A8A8",
              letterSpacing: "0.24px",
              dy: 5,
              dx: 15,
              className: "custom-axis-label",
            }}
            // padding={{ left: 5 }}
            // domain={['dataMin', 'dataMax']}
          />
          <YAxis
            ticks={[0, 5, 10, 15, 20, 25]}
            tickLine={false}
            interval={0}
            stroke="#A8A8A8"
            axisLine={{ stroke: "#2E2E2E" }}
            // tickFormatter={formatYAxisLabel}
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
          {/* <Tooltip /> */}
          {/* <Area
              type="monotone"
              dataKey="uv"
              stroke="#486DF0"
              //   fill="url(#colorGradient)"
               fill="#1D212E"
              strokeWidth={2}
              // dot={{ stroke: '#00FF00', fill: '#00FF00', r: 15 }} 
              // activeDot={{ r: 10 }}
            /> */}
        </AreaChart>
      </ResponsiveContainer>
      <div className="text-[20px] text-roboto font-[400] absolute top-[40%] left-[40%]">
        No Chart Data Found
      </div>
    </div>
  );
};

export default NoDataFoundChart;
