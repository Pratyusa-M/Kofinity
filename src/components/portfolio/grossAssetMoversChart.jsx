/* eslint-disable react/prop-types */
import { FaArrowUp } from "react-icons/fa6";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  // Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

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
    uv: 5,
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
    uv: 10,
    pv: 43,
    amt: 21,
  },
];

const GrossAssetMoversChart = ({ moversText }) => {
  return (
    <div className="bg-[#1D1D1F] w-[296px] rounded-[2px] p-[10px]">
      <p className="text-[#fff] text-[12px] font-[400] text-roboto">
        {moversText}
      </p>
      <div className="w-[100%] mt-[25px] flex items-center justify-between">
        <div>
          <p className="text-[20px] text-lato font-[400] text-[#FFFFFF]">
            $96,000
          </p>
          <div className="flex items-center gap-[4px] mt-[5px]">
            <p className="text-[12px] text-lato font-[400] text-[#1FB98B]">
              +$6,000
            </p>
            <p className="w-[56px] h-[18px] text-[10px] text-lato font-[400] text-[#1FB98B] bg-[#2E2E2E] flex items-center justify-center rounded-[2px] gap-1">
              <span>+40% </span>
              <FaArrowUp className="w-[11px] h-[11px]" />
            </p>
          </div>
        </div>
        <div>
          <ResponsiveContainer width={136} height={75}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1FB98B" />
                  <stop offset="100%" stopColor="#4BB543" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                horizontal={false}
              />
              <XAxis dataKey="month" hide />
              <YAxis domain={[1, "auto"]} hide />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#1FB98B"
                strokeWidth={2}
                // fill={`url(#colorGradient)`}
                fill="#1E2A27"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GrossAssetMoversChart;
