/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import NodataProjectionChart from "./noDataProjectionCart";

const data = [
  {
    name: "01/08/2016",
    uv: 0,
    pv: 0,
    amt: 24,
  },
  {
    name: "02/08/2016",
    uv: 0,
    pv: 5,
    amt: 22,
  },
  {
    name: "03/08/2016",
    uv: 0,
    pv: 10,
    amt: 22,
  },
  {
    name: "04/08/2016",
    uv: 0,
    pv: 15,
    amt: 20,
  },
  { name: "05/08/2016", uv: 0, pv: 20, amt: 21 },
  {
    name: "06/08/2016",
    uv: 10,
    pv: 25,
    amt: 25,
  },
  {
    name: "07/08/2016",
    uv: 10,
    pv: 25,
    amt: 21,
  },
  {
    name: "08/08/2016",
    uv: 10,
    pv: 20,
    amt: 21,
  },
];

const ProjectionChart = ({ data }) => {
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
        <div className="bg-[#191919] max-h-[523px] w-[100%]">
          <div className="overflow-x-auto">
            <div className=" min-w-[500px] ">
              <ResponsiveContainer width={"100%"} height={365}>
                <LineChart
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
                    strokeDasharray="0 0"
                    stroke="#212121"
                  />
                  <XAxis
                    dataKey="year"
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
                  />
                  <YAxis
                    tickLine={false}
                    // ticks={[0,5,10,15,20,25]}
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
                      `${name}: ${value?.toFixed(2)}`,
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="netWorth"
                    stroke="#975FEA"
                    fill="#241C23"
                    strokeWidth={1}
                    dot={false}
                    // yAxisId="solid"
                    // strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <NodataProjectionChart />
      )}
    </div>
  );
};

export default ProjectionChart;
