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

const NodataProjectionChart = () => {
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
    <div className="bg-[#191919] max-h-[523px] w-[100%] relative">
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
            dataKey="name"
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
            ticks={[0, 5, 10, 15, 20, 25]}
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
          {/* <Tooltip /> */}
          <Line
            type="monotone"
            dataKey="netWorth"
            stroke="#975FEA"
            fill="#241C23"
            strokeWidth={1}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-[20px] text-roboto font-[400] absolute top-[40%] left-[40%]">
        No Data Found
      </div>
    </div>
  );
};

export default NodataProjectionChart;
