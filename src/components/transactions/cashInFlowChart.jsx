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
  ReferenceLine,  
} from "recharts";

import { FaArrowUp } from "react-icons/fa6";

const data1 = [
  {
    name: "01/08/2016",
    uv: 0,
    pv: 0,
    amt: 0,
  },
  {
    name: "02/08/2016",
    uv: 15,
    pv: 10,
    amt: 3,
  },
  {
    name: "03/08/2016",
    uv: 10,
    pv: 9,
    amt: 7,
  },
  {
    name: "04/08/2016",
    uv: 8,
    pv: 6,
    amt: 4,
  },
  { name: "05/08/2016", uv: 9, pv: 5, amt: 2 },
  {
    name: "06/08/2016",
    uv: 10,
    pv: 9,
    amt: 7,
  },
  {
    name: "07/08/2016",
    uv: 9,
    pv: 7,
    amt: 5,
  },
  {
    name: "08/08/2016",
    uv: 7,
    pv: 5,
    amt: 3,
  },
];

const CashInFlowChart = ({
  data,
  dateKey,
  cashFlowValue,
  cashFlowValuePercent,
  assetvalue,
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
        <div className=" bg-[#191919] w-[100%] rounded ">
          <div className="flex items-center gap-2 mb-[18px]">
            <p className="text-[24px] text-lato font-[400] text-[#FFFFFF]">
              {selectedCurencySymbol}
              {FormatNumberWithCommas(assetvalue || 0) || 0}
            </p>
            <p
              className={`text-[16px] text-lato font-[400] ${
                cashFlowValuePercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
              }`}
            >
              {selectedCurencySymbol}
              {FormatNumberWithCommas(cashFlowValue || 0) || 0}
            </p>
            <p
              className={` h-[18px] text-[12px] text-lato font-[400] bg-[#2E2E2E] flex items-center justify-center rounded-[2px] gap-1 ${
                cashFlowValuePercent >= 0 ? "text-[#1FB98B]" : "text-[#B91F1F]"
              }`}
            >
              <span>{cashFlowValuePercent?.toFixed(2) || 0}% </span>
              {cashFlowValuePercent >= 0 ? (
                <FaArrowUp />
              ) : (
                <img src={downArrow} alt="d-arrow" />
              )}
            </p>
          </div>
          <div className="">
            <div className="w-full ">
              <ResponsiveContainer width={"100%"} height={345}>
                <AreaChart
                  // width={880}
                  // height={300}
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
                    // padding={{ left: 20 }}
                    tick={{
                      fontSize: 10,
                      fontFamily: "roboto",
                      fill: "#A8A8A8",
                      letterSpacing: "0.24px",
                      dy: 5,
                      dx: 0,
                      className: "custom-axis-label",
                    }}
                  />
                  <YAxis
                    // ticks={[-10, -5, 0, 5, 10, 15, 20, 25]}
                    tickLine={false}
                    interval={0}
                    stroke="#A8A8A8"
                    axisLine={{ stroke: "#2E2E2E" }}
                    tickFormatter={formatYAxisLabel}
                    tick={{
                      fontSize: 12,
                      fontFamily: "roboto",
                      fill: "#A8A8A8",
                      letterSpacing: "0.24px",
                      //dy: 0,
                      // className: "custom-axis-label",
                    }}
                    //   domain={[0, "dataMax + 1000"]}
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
                      `${"Total Cash Flow"}: ${value?.toFixed(2)}`,
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="total_cashFlow"
                    stroke="#6F50E5"
                    fill="#221F2D"
                    strokeWidth={2}
                    strokeDasharray="0 0"
                  />
                  {/* <Tooltip /> */}
                  {/* <Area
                    type="monotone"
                    dataKey="stock_cashFlow"
                    stroke="#D6475D"
                    fill="#221F2C"
                    strokeWidth={2}
                  /> */}

                  {/* <Area
                    type="monotone"
                    dataKey="crypto_cashFlow"
                    stroke="green"
                    fill="#221F2C"
                    strokeWidth={2}
                  /> */}

                  {/* <Area
                    type="monotone"
                    dataKey="realEstate_cashFlow"
                    stroke="#9761EA"
                    fill="#2B222F"
                    strokeWidth={2}
                    // activeDot={{ r: 10 }}
                  /> */}
                  {/* <Area
                    type="monotone"
                    dataKey="otherAsset_cashFlow"
                    stroke="yellow"
                    fill="#2B222F"
                    strokeWidth={2}
                    // activeDot={{ r: 10 }}
                  /> */}
                  {/* <Area
                    type="monotone"
                    dataKey="bankAccount_cashFlow"
                    stroke="orange"
                    fill="#2B222F"
                    strokeWidth={2}
                    // activeDot={{ r: 10 }}
                  /> */}
                             <ReferenceLine
  y={0}
  stroke="#444"
/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* <div className="flex items-center gap-[32px] ml-[55px] mt-[8px]">
        {timePeriod.map((each,idx) => {
          return (
            <button
              onClick={() => onSelectTp(each)}
              key={idx}
              className={`w-[55px] h-[27px] text-[#A8A8A8] text-[12px] text-roboto font-[400] hover:bg-[#2E2E2E] hover:bg-opacity-50 hover:rounded-[13.5px] flex items-center justify-center ${
                tpId === each.id && "bg-[#2E2E2E] rounded-[13.5px]"
              }`}
            >
              {each.tp}
            </button>
          );
        })}
      </div> */}
        </div>
      ) : (
        <NoDataFoundChart
          profit={cashFlowValue}
          profitPercent={cashFlowValuePercent}
        />
      )}
    </div>
  );
};

export default CashInFlowChart;
