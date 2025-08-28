/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import NoDataFoundChart from "../common/noDataFoundChart";
import { useState } from "react";
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
import caretdown from "../../assets/CaretDown.svg";
import DownArrow from "../../assets/arrow2.svg";
import { useNavigate } from "react-router-dom";
import { FormatNumberWithCommas } from "../common/commaSeparatedNumbers";
import { useDispatch, useSelector } from "react-redux";
import { SelectedCurrencySymbol } from "../../redux/store/slice/currencySlice";

const data1 = [
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

const GrossAssetValueChart = ({
  data,
  dateKey,
  grossAssetProfit,
  grossAssetProfitPercent,
  assetValue,
}) => {
  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);

  const formatYAxisLabel = (value) => {
    if (value === 0) {
      return "0";
    } else if (Math.abs(value) >= 1000000) {
      return `${value >= 0 ? "" : "-"}${Math.abs(value) / 1000000}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${value >= 0 ? "" : "-"}${Math.abs(value) / 1000}k`;
    }
    return `${value >= 0 ? "" : "-"}${Math.abs(value)}`;
  };

  return (
    <div className="">
      {data?.length > 0 ? (
        <div className="bg-[#191919] w-[100%] rounded">
          <div className="flex items-center gap-2 mb-[18px] flex-wrap">
            <p className="text-[24px] text-lato font-[400] text-[#FFFFFF]">
              {selectedCurencySymbol}
              {FormatNumberWithCommas(assetValue || 0) || 0}
            </p>
            <div className="flex items-center gap-2">
              <p
                className={`text-[16px] text-lato font-[400] ${
                  grossAssetProfitPercent >= 0
                    ? "text-[#1FB98B]"
                    : "text-[#B91F1F]"
                }`}
              >
                {selectedCurencySymbol}
                {FormatNumberWithCommas(grossAssetProfit || 0) || 0}
              </p>
              <p
                className={`h-[18px] text-[12px] text-lato font-[400] bg-[#2E2E2E] flex items-center justify-center rounded-[2px] gap-1  ${
                  grossAssetProfitPercent >= 0
                    ? "text-[#1FB98B]"
                    : "text-[#B91F1F]"
                }`}
              >
                <span>{grossAssetProfitPercent?.toFixed(2) || 0}% </span>
                {grossAssetProfitPercent >= 0 ? (
                  <FaArrowUp />
                ) : (
                  <img src={DownArrow} alt="d-arrow" />
                )}
              </p>
            </div>
          </div>
          <div className="">
            <div className="w-full">
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
                    dataKey={dateKey}
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
                    padding={{ right: 10 }}
                    // domain={['dataMin', 'dataMax']}
                  />
                  <YAxis
                    // ticks={[0, 5, 10, 15, 20,25]}
                    tickLine={false}
                    interval={0}
                    stroke="#A8A8A8"
                    axisLine={{ stroke: "#2E2E2E" }}
                    tickFormatter={formatYAxisLabel}
                    domain={[1, "auto"]}
                    tick={{
                      fontSize: 10,
                      fontFamily: "roboto",
                      fill: "#A8A8A8",
                      letterSpacing: "0.24px",
                      // dy:-10
                      // className: "custom-axis-label",
                    }}
                    padding={{ bottom: 10 }}
                    width={90}
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
                    dataKey="current_totalAsset_value"
                    stroke="#9B51E0"
                    //   fill="url(#colorGradient)"
                    fill="#261F2D"
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
          profit={grossAssetProfit}
          profitPercent={grossAssetProfitPercent}
        />
      )}
    </div>
  );
};

export default GrossAssetValueChart;
