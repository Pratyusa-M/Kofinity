import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  // Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { FaArrowUp } from "react-icons/fa6";
import caretdown from "../../assets/CaretDown.svg";

const data = [
  {
    name: "01/08/2016",
    uv: 0,
    pv: 24,
    amt: 24,
  },
  {
    name: "02/08/2016",
    uv: 0,
    pv: 13,
    amt: 22,
  },
  {
    name: "03/08/2016",
    uv: 0,
    pv: 98,
    amt: 22,
  },
  {
    name: "04/08/2016",
    uv: 0,
    pv: 39,
    amt: 20,
  },
  { name: "05/08/2016", uv: 0, pv: 48, amt: 21 },
  {
    name: "06/08/2016",
    uv: 10,
    pv: 38,
    amt: 25,
  },
  {
    name: "07/08/2016",
    uv: 10,
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

const NetAssetvalueChart = () => {
  const [tpId, setTpId] = useState(1);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(2);
  const navigate = useNavigate();

  const timePeriod = [
    { id: 1, tp: "1D" },
    { id: 2, tp: "7D" },
    { id: 3, tp: "1M" },
    { id: 4, tp: "YTD" },
    { id: 5, tp: "1Y" },
    { id: 6, tp: "ALL" },
  ];

  const formatYAxisLabel = (value) => {
    // return value === 0 ? `${value}` : `${value}M`;
    if (value === 0) {
      return "0";
    }
    if (value >= 1000) {
      return `${value / 1000000}M`;
    }
    return value.toString() + "M";
  };

  const onSelectTp = (each) => {
    setTpId(each.id);
  };

  const assetsData = [
    { id: 1, opt: "Gross Asset Value(GAV)" },
    { id: 2, opt: "Net Asset Value(NAV)" },
  ];

  const openDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const onClickvalue = (id) => {
    setSelectedOption(id);
    setDropdownOpen(false);
    if (id === 1) {
      navigate("/allassets");
    } else {
      navigate("/netassetvalue");
    }
  };

  return (
    <div className="bg-[#191919] w-[100%] rounded p-[24px]">
      <div
        onClick={openDropdown}
        className="text-roboto font-[500] text-[16px] text-[#F6F8FB] mb-[12px] flex items-center gap-2 relative"
      >
        Net Asset Value <img src={caretdown} alt="down" />
      </div>
      {isDropdownOpen && (
        <div className="absolute top-[160px] rounded pt-0 bg-[#2E2E2E] w-[297px] h-auto  flex flex-col z-10 overflow-y-auto">
          {assetsData?.map((each, idx) => (
            <p
              key={idx}
              onClick={() => onClickvalue(each.id, each.opt)}
              className={`text-[#F6F8FB] text-[16px] font-[400] text-roboto my-1 pl-2  hover:bg-[#3E3E3E] cursor-pointer ${
                selectedOption === each.id && "bg-[#3E3E3E]"
              }
                 `}
            >
              {each.opt}
            </p>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mb-[18px]">
        <p className="text-[24px] text-lato font-[400] text-[#FFFFFF]">
          $96,000
        </p>
        <p className="text-[16px] text-lato font-[400] text-[#1FB98B]">
          +$6,000
        </p>
        <p className="w-[56px] h-[18px] text-[12px] text-lato font-[400] text-[#1FB98B] bg-[#2E2E2E] flex items-center justify-center rounded-[2px] gap-1">
          <span>+40% </span>
          <FaArrowUp />
        </p>
      </div>
      <ResponsiveContainer width={"100%"} height={345}>
        <AreaChart
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
              dx: 15,
              className: "custom-axis-label",
            }}
            // padding={{ left: 5 }}
            // domain={['dataMin', 'dataMax']}
          />
          <YAxis
            ticks={[0, 5, 10, 15, 20, 25]}
            tickLine={false}
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
              // dy:-10
              // className: "custom-axis-label",
            }}
            padding={{ bottom: 10 }}
            //  width={10}
          />
          {/* <Tooltip /> */}
          <Area
            type="step"
            dataKey="uv"
            stroke="#975FEA"
            //   fill="url(#colorGradient)"
            fill="#241C23"
            strokeWidth={2}
            // dot={{ stroke: '#00FF00', fill: '#00FF00', r: 15 }}
            // activeDot={{ r: 10 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-[32px] ml-[55px] mt-[8px]">
        {timePeriod.map((each) => {
          return (
            <button
              onClick={() => onSelectTp(each)}
              key={each.idx}
              className={`w-[55px] h-[27px] text-[#A8A8A8] text-[12px] text-roboto font-[400] flex justify-center items-center hover:bg-[#2E2E2E] hover:bg-opacity-50 hover:rounded-[13.5px] ${
                tpId === each.id && "bg-[#2E2E2E] rounded-[13.5px]"
              }`}
            >
              {each.tp}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NetAssetvalueChart;
