/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import NoDataFoundChart from "../common/noDataFoundChart";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";

const data = [
  {
    name: "",
    uv: 0, // red
    pv: 10, // green
    label: "Total Cashflow",
  },
  {
    name: "",
    uv: 7,
    pv: 0,
    label: "Stocks",
  },
  {
    name: "",
    uv: 10,
    pv: 0,
    label: "Real Estate", 
  },
  {
    name: "",
    uv: 8,
    pv: 0,
    label: "Crypto",
  },
  { name: "", uv: 0, pv: 10, label: "Bank Account" },
  {
    name: "",
    uv: 0,
    pv: 9,
    label: "Other Assets",
  },
];

const CashFlowBarChart = ({ data }) => {
  const [selectedOption, setSelectedOption] = useState(null);
console.log("barchartdata", data);
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



const RadioTypeData = [
  { id: 1, data: "Total Cashflow",  color: "#9b87f5" }, // purple
  { id: 2, data: "Stocks",         color: "#f59e0b" }, // orange
  { id: 3, data: "Real Estate",    color: "#fbbf24" }, // amber
  { id: 4, data: "Crypto",         color: "#3b82f6" }, // blue
  { id: 5, data: "Bank Account",   color: "#06b6d4" }, // indigo
  { id: 6, data: "Other Assets",   color: "#ec4899" }, // pink
];


  const handleOptionChange = (each) => {
    setSelectedOption(each.id);
  };

  return (
    <div>
      {data?.length > 0 ? (
        <div className="bg-[#191919] w-[100%] rounded overflow-x-auto">
          <div className="min-w-[900px] w-[100%] -ml-1 z-0">
            <ResponsiveContainer width={"100%"} height={403}>
              <BarChart
                data={data}
                stackOffset="sign"
                margin={{
                  top: 5,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
                barCategoryGap={"15%"}
              >
                <CartesianGrid
                  vertical={false}
                  horizontal={false}
                  strokeDasharray="0 0"
                  stroke="#212121"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  interval={0}
                  stroke="#A8A8A8"
                  axisLine={{ stroke: "#2E2E2E" }}
                  // padding={{ left: 20 }}
                  tick={null}
                  //   tick={{
                  //     fontSize: 10,
                  //     fontFamily: "roboto",
                  //     fill: "#A8A8A8",
                  //     letterSpacing: "0.24px",
                  //     //  dy: -30,
                  //     // dx: 15,
                  //     // className: "custom-axis-label",
                  //   }}
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
                    dy: 0,
                    // className: "custom-axis-label",
                  }}
                  width={30}
                  //   domain={[0, "dataMax + 1000"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2E2E2E",
                    border: "none",
                    borderRadius: "4px",
                    color: "#FFFFFF",
                    fontSize: "15px",
                  }}
                  cursor={{ fill: "transparent" }}
                  formatter={(value, name) => [
                    `${name} : ${value?.toFixed(2)}`,
                  ]}
                />
                {/* <ReferenceLine y={0} stroke="#000" /> */}

                <Bar dataKey="uv" fill="#B91F1F" stackId="stack" barSize={40} />
                <Bar dataKey="pv" fill="#1FB98B" stackId="stack"  barSize={40} />
                <ReferenceLine
  y={0}
  stroke="#444"
/>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between px-[50px] pl-[40px] md:pl-[50px] gap-10 ">
            {data.map(({ label, pv, uv }, idx) => {
              const color = pv > 0 ? "#1FB98B" : "#B91F1F";
              return (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <span
                    className="w-3 h-3 rounded-full mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[#fff] text-[12px] text-center leading-tight max-w-[80px]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      ) : (
        <NoDataFoundChart />
      )}
    </div>
  );
};

export default CashFlowBarChart;
