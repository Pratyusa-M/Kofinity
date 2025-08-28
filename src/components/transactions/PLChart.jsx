/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import NoDataFoundChart from "../common/noDataFoundChart";
import downArrow from "../../assets/arrow2.svg";
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
  ReferenceLine,
} from "recharts";

import { FaArrowUp } from "react-icons/fa6";
import { FormatNumberWithCommas } from "../common/commaSeparatedNumbers";

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

const PLChart = ({ data, dateKey, PlValue, plValuePercent, profit }) => {
  const selectedCurencySymbol = useSelector(SelectedCurrencySymbol);

  const formatTickValue = (value) => {
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
        <div className="bg-[#191919] w-[100%] rounded">
          {/* <p className="text-roboto font-[500] text-[16px] text-[#F6F8FB] mb-[12px]">
        Net P&L
      </p> */}
          <div className="flex items-center gap-2 mb-[18px]">
            <p className="text-[24px] text-lato font-[400] text-[#FFFFFF]">
              {selectedCurencySymbol}
              {FormatNumberWithCommas(profit || 0) || 0}
            </p>
            <p
              className={`text-[16px] text-lato font-[400] ${
                plValuePercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
              }`}
            >
              {selectedCurencySymbol}
              {FormatNumberWithCommas(PlValue || 0) || 0}
            </p>
            <p
              className={`w-[56px] h-[18px] text-[12px] text-lato font-[400] bg-[#2E2E2E] flex items-center justify-center rounded-[2px] gap-1 ${
                plValuePercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
              }`}
            >
              <span>{plValuePercent?.toFixed(2) || 0}% </span>
              {plValuePercent >= 0 ? (
                <FaArrowUp />
              ) : (
                <img src={downArrow} alt="d-arrow" />
              )}
            </p>
          </div>
          <div className="">
            <div className="w-full">
              <ResponsiveContainer width={"100%"} height={345}>
                <AreaChart
                  // width={'100%'}
                  // height={'100%'}
                  data={data}
                  margin={{
                    top: 10,
                    right: 20,
                    left: -20,
                    bottom: 0,
                  }}
                >
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
                      // className: "custom-axis-label",
                    }}
                    // padding={{ left: 5 }}
                    // domain={['dataMin', 'dataMax']}
                  />
                  <YAxis
                    // ticks={[-10, -5, 0, 5, 10, 15, 20,25]}
                    tickLine={false}
                    interval={0}
                    stroke="#A8A8A8"
                    axisLine={{ stroke: "#2E2E2E" }}
                    tickFormatter={formatTickValue}
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
                      `${"Net Profit & Loss"}: ${value?.toFixed(2)}`,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="net_profit_loss"
                    stroke="#0062FF"
                    fill="#172030"
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
        <NoDataFoundChart profit={PlValue} profitPercent={plValuePercent} />
      )}
    </div>
  );
};

export default PLChart;
