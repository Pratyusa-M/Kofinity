/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import NoDataFoundChart from "../common/noDataFoundChart";
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

const data1 = [
  {
    name: "01/08/2016",
    uv: 0,
    pv: 5,
    amt: 3,
  },
  {
    name: "02/08/2016",
    uv: 5,
    pv: 10,
    amt: 3,
  },
  {
    name: "03/08/2016",
    uv: 6,
    pv: 7,
    amt: 8,
  },
  {
    name: "04/08/2016",
    uv: 4,
    pv: 5,
    amt: 6,
  },
  { name: "05/08/2016", uv: 2, pv: 3, amt: 5 },
  {
    name: "06/08/2016",
    uv: 7,
    pv: 8,
    amt: 9,
  },
  {
    name: "07/08/2016",
    uv: 6,
    pv: 7,
    amt: 8,
  },
  {
    name: "08/08/2016",
    uv: 5,
    pv: 4,
    amt: 3,
  },
];

const DebtAssetChart = ({ data, dateKey }) => {
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

  const filteredData = data?.filter((item) => {
    return Object.values(item).every((value) => value !== null);
  });

  return (
    <div>
      {filteredData?.length > 0 ? (
        <div className="bg-[#191919] w-[100%] rounded overflow-x-auto">
          <div className="w-full">
            <ResponsiveContainer width={"100%"} height={403}>
              <AreaChart
                // width={880}
                // height={300}
                data={filteredData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
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
                  // padding={{ left: 20 }}
                  tick={{
                    fontSize: 10,
                    fontFamily: "roboto",
                    fill: "#A8A8A8",
                    letterSpacing: "0.24px",
                    dy: 5,
                    dx: 0,
                    // className: "custom-axis-label",
                  }}
                />
                <YAxis
                  // ticks={[0, 5, 10, 15, 20, 25]}
                  tickLine={false}
                  interval={0}
                  stroke="#A8A8A8"
                  axisLine={{ stroke: "#2E2E2E" }}
                  width={30}
                  tickFormatter={formatTickValue}
                  tick={{
                    fontSize: 12,
                    fontFamily: "roboto",
                    fill: "#A8A8A8",
                    letterSpacing: "0.24px",
                    dy: -5,
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
                  formatter={(value, name) => [`${name}: ${value?.toFixed(2)}`]}
                />
                {/* <Area
                  type="monotone"
                  dataKey="total_net_value"
                  stroke="#0062FF"
                  fill="#172030"
                  strokeWidth={2}
                  // strokeDasharray="5 5"
                /> */}
                <Area
                  type="monotone"
                  dataKey="total_loan_balance"
                  stroke="#D6475D"
                  fill="#2C1D20"
                  strokeWidth={2}
                />
                            <ReferenceLine
  y={0}
  stroke="#444"
/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <NoDataFoundChart debtAssetCond={true} />
      )}
    </div>
  );
};

export default DebtAssetChart;
