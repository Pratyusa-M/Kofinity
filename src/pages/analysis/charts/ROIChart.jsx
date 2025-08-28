import React from "react";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  ReferenceLine,
  Cell,
} from "recharts";

const formatShortNumber = (num) => {
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M%`;
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)}K%`;
  return `${num.toFixed(1)}%`;
};

const formatter = new Intl.NumberFormat()

const ROIChart = ({ data }) => {
  console.log("data roi", data);

  const CustomCursor = ({ points, height }) => {
    const x = points?.[0]?.x;
    if (x == null) return null;

    return (
      <g className="recharts-layer recharts-custom-cursor">
        <line
          x1={x}
          x2={x}
          y1={0}
          y2={height}
          stroke="#ffffff"
          strokeWidth={2}
          strokeDasharray="10 10"
          z={1000}
          layerId="100"
          strokeLinejoin="round"
        />
      </g>
    );
  };

  return (
    <div className="bg-[#0a0a0c] border border-b-[#19191D] rounded-2xl p-1 md:p-5 h-full w-full text-white">
      <div className="flex justify-between items-center mb-4 p-5">
        <h2 className="text-lg font-semibold">ROI</h2>
        {/* Optional button like 'Scenarios' can be added here */}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          barCategoryGap={30}
        >
          <CartesianGrid
            strokeDasharray="6 6"
            vertical={false}
            stroke="#2E2E2E"
          />

          <XAxis
            dataKey="year"
            tick={{ fill: "#A8A8A8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="left"
            domain={["auto", "auto"]}
             tickFormatter={(val) => formatter.format(val)}
            tick={{ fill: "#A8A8A8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[-100, 100]}
             tickFormatter={(val) => `${formatter.format(val)}%`}
            tick={{ fill: "#A8A8A8", fontSize: 12 }}
            width={20}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "rgba(40, 40, 50, 0.5)",
              borderRadius: "10px",
              backdropFilter: "blur(6px)",
              border: "1px solid #333",
              color: "#fff",
            }}
            labelStyle={{ color: "#ccc", fontSize: 12 }}
            formatter={(value, name) => {
              const num = Number(value);
              const formatted = formatter.format(Number(num.toFixed(2)));
              return name === "ROI"
                ? [`${formatted}%`, name]
                : [formatted, name];
            }}
            cursor={false}
          />

          <Bar
            dataKey="cashFlow"
            name="CF"
            fill="#9b87f5"
            barSize={20}
            radius={[4, 4, 0, 0]}
            yAxisId="left"
          >
            {data.map((entry, index) => (
              <Cell
                key={`bar-${index}`}
                fill={entry.cashFlow < 0 ? "#6b5fc6" : "#9b87f5"}
              />
            ))}
          </Bar>

          <Line
            type="monotone"
            dataKey="roi"
            stroke="#fef08a"
            name="ROI"
            strokeWidth={2}
            dot={{ stroke: "#fef08a", strokeWidth: 2, r: 0, fill: "#0a0a0c" }}
            activeDot={{
              r: 6,
              fill: "#0a0a0c",
              stroke: "#fef08a",
              strokeWidth: 3,
            }}
            yAxisId="right"
          />

          <ReferenceLine y={0} stroke="#333" yAxisId="left" />

          <Legend
            verticalAlign="bottom"
            align="center"
            height={0}
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-gray-300">{value}</span>
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ROIChart;
