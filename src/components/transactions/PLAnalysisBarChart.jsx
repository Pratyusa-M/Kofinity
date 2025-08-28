/* eslint-disable react/prop-types */
import NoDataFoundChart from "../common/noDataFoundChart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, ReferenceLine
} from "recharts";

const PLAnalysisBarChart = ({ data }) => {
  // const data = [
  //   { uv: 0,  pv: 41, label: "Total Cashflow" },
  //   { uv: 20, pv: 0,  label: "Stocks" },
  //   { uv: 0,  pv: 40, label: "Real Estate" },
  //   { uv: 10, pv: 0,  label: "Crypto" },
  //   { uv: 0,  pv: 50, label: "Bank Account" },
  //   { uv: 30, pv: 0,  label: "Other Assets" },
  // ];

  if (!data.length) return <NoDataFoundChart />;

  const formatTick = (v) => {
    if (v === 0) return "0";
    if (Math.abs(v) >= 1e6) return `${(v/1e6).toFixed(1)}M`;
    if (Math.abs(v) >= 1e3) return `${(v/1e3).toFixed(1)}k`;
    return v;
  };

  return (
    <div className="bg-[#191919] w-full rounded overflow-hidden">
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="py-4" style={{ minWidth: '600px' }}>
          {/* Chart */}
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                stackOffset="sign"
                margin={{ top: 5, right: 30, left: 0, bottom: 80 }}
                barCategoryGap="15%"
              >
                <CartesianGrid vertical={false} horizontal={false} stroke="#212121" />
                <XAxis
                  dataKey="label"
                  axisLine={{ stroke: "#2E2E2E" }}
                  tickLine={false}
                  tick={false}
                />
                <YAxis
                  tickLine={false}
                  stroke="#A8A8A8"
                  axisLine={{ stroke: "#2E2E2E" }}
                  tickFormatter={formatTick}
                  tick={{ fontSize: 12, fill: "#A8A8A8" }}
                  width={30}
                 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2E2E2E",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "15px",
                    color: "#fff",
                  }}
                  cursor={{ fill: "transparent" }}
                  formatter={(val) => val.toFixed(2)}
                />
                <ReferenceLine y={0} stroke="#444" />
                <Bar dataKey="pv" fill="#1FB98B" stackId="stack" barSize={40} />
                <Bar dataKey="uv" fill="#B91F1F" stackId="stack" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Simple flexbox legend that matches chart spacing */}
          <div className="flex justify-between px-[50px] pl-[40px] md:pl-[50px] gap-10 -mt-20">
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
    </div>
  );
};

export default PLAnalysisBarChart;