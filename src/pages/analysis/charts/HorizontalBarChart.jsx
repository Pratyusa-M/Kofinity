import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from 'recharts';
import { useIsMobile } from '../../admin/hooks/use-mobile';

const formatShortNumber = (num) => {
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M%`;
  if (Math.abs(num) >= 1_000) return `${(num / 1_000).toFixed(1)}K%`;
  return `${num.toFixed(1)}%`;
};


const HorizontalBarChart = ({
  title,
  data,      
  color,
  xAxisFormatter = (v) => `${v}%`,
}) => {
  console.log("data", data);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = React.useState('top');
  const roundFormatter = (v) => `${Math.round(v)}%`;

  const chartData = React.useMemo(() => {
    const list = activeTab === 'top' ? data.top5 : data.bottom5;
    return list?.map((item) => ({
      name: item.assetName,
      value: title === "Expense Ratio"?  item.expenseRatio : title === "Yield"? item.yieldRatio : title === "ROI Breakdown"? item.roi : "",
textValue:
  title === "Expense Ratio"
    ? formatShortNumber(item.expenseRatio)
    : title === "Yield"
    ? formatShortNumber(item.yieldRatio)
    : title === "ROI Breakdown"
    ? formatShortNumber(item.roi)
    : "",
    }));
  }, [activeTab, data]);

  return (
    <div className="border border-b-[#19191D] rounded-2xl py-5 h-full text-white">
      <div className="flex justify-between items-center mb-4 px-5">
        <h2 className="text-lg font-medium ">{title}</h2>
        <div className="flex items-center text-xs bg-gray-800 rounded-md overflow-hidden">
          <button
            className={`px-3 h-[24px] py-1 ${activeTab === 'top' ? 'bg-gray-700' : ''}`}
            onClick={() => setActiveTab('top')}
          >
            Top 5
          </button>
          <button
            className={`px-3 h-[24px] py-1 ${activeTab === 'bottom' ? 'bg-gray-700' : ''}`}
            onClick={() => setActiveTab('bottom')}
          >
            Bottom 5
          </button>
        </div>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
  <BarChart
    layout="vertical"
    data={chartData}
    margin={{ top: 10, right: 60, left: 10, bottom: 10 }}
    barSize={16}
    barCategoryGap={8}
  >
    <CartesianGrid
      strokeDasharray="4 2"
      
      horizontal={false}
      vertical={true}
      stroke='#FFFFFF'
      strokeWidth={2}
      opacity={1}
       
    />
    <XAxis
      type="number"
      tick={{ fill: '#888', fontSize: 10 }}
      tickFormatter={formatShortNumber}
      axisLine={{ stroke: '#333' }}
      tickLine={{ stroke: '#333' }}
      domain={[0, (dataMax) => Math.max(dataMax, 20)]}
      
    />
    <YAxis
      dataKey="name"
      type="category"
      tick= {isMobile ? false :{ fill: '#888', fontSize: 12 }}
      axisLine={isMobile ? false :   { stroke: '#333' }}
      tickLine={isMobile ? false : { stroke: '#333' }}
      width={isMobile ? 0: 80}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: '#222',
        border: 'none',
        borderRadius: '8px',
        padding: '8px',
      }}
      formatter={(value, name, props) => [props.payload.textValue, '']}
      cursor={{ fill: 'transparent' }}
    />
    <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]}>
  <LabelList
    dataKey="textValue"
    content={({ x, y, width, value, index }) => {
       const barData = chartData[index];
      const chartPadding = 10; // space from chart edge
      const isNegative = value < 0;
      const labelWidth = 40; // rough label size

      const isTooLeft = isNegative && x - labelWidth < chartPadding;
      const isTooRight = !isNegative && x + width + labelWidth > 330; // adjust 330 based on chart width


      return (
        <>
        {isMobile  && (
        <text
          x={isNegative ? x + width + 8 : x - 1}
          y={y - 6}
          fill="#aaa"
          fontSize={11}
          textAnchor="start"
        >
          {barData.name}
        </text>)}
        <text
          x={isNegative ? x - 8 : x + width + 8}
          y={y + 12}
          fill="#fff"
          fontSize={12}
          textAnchor={isNegative ? "end" : "start"}
        >
          {value}
        </text>
        </>
      );
    }}
  />
</Bar>

  </BarChart>
</ResponsiveContainer>

      </div>
    </div>
  );
};

export default HorizontalBarChart;
